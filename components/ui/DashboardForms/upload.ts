import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { Fields, Files } from 'formidable';
import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import OpenAI from 'openai';

export const config = {
  api: {
    bodyParser: false
  }
};

const openai = new OpenAI();

const parseForm = (
  req: NextApiRequest
): Promise<{ fields: Fields; files: Files }> => {
  return new Promise((resolve, reject) => {
    const form = formidable({
      uploadDir: path.join(process.cwd(), 'uploads'),
      keepExtensions: true
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        resolve({ fields, files });
      }
    });
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { fields, files } = await parseForm(req);
      const file = files.pdf as formidable.File[];
      if (!file[0]?.filepath) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const dataBuffer = fs.readFileSync(file[0].filepath);
      const query = fields.query as unknown as string;

      try {
        const data = await pdfParse(dataBuffer);
        const text = data.text;

        const openaiResponse = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You will be provided with a prompt regarding uploaded text: ${text}. Provide user with an answer and a quote that proves the answer in a format: answer|"citation".`
            },
            {
              role: 'user',
              content: query
            }
          ],
          max_tokens: 500
        });

        const content = openaiResponse.choices[0]?.message?.content ?? '';

        if (!content) {
          return res
            .status(500)
            .json({ error: 'No content returned from OpenAI' });
        }

        const citations = content.split('|');

        res.status(200).json({ citations });
      } catch (error) {
        res
          .status(500)
          .json({ error: 'Error processing PDF or OpenAI API call' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Error processing form' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
