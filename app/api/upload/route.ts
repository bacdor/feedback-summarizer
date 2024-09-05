import { NextRequest, NextResponse } from 'next/server';
// @ts-ignore
import pdf from 'pdf-parse/lib/pdf-parse';
import { Buffer } from 'buffer';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { message: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Read the file content
    const buffer = Buffer.from(await file.arrayBuffer());

    // Extract text from the PDF
    const textContent = await pdf(buffer);

    return NextResponse.json({
      message: 'PDF uploaded and question answered successfully',
      text: textContent.text
    });
  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json(
      {
        message: 'Failed to process the file, your file is too large.',
        error: error
      },
      { status: 500 }
    );
  }
}
