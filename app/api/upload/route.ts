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
    // Check if error is an instance of Error
    if (error instanceof Error) {
      if (error.message.includes('Timeout')) {
        return NextResponse.json(
          {
            message:
              'Failed to process the file, your file is too large or the process took too long. Please try again.'
          },
          { status: 504 }
        );
      }
      return NextResponse.json({ message: error.message }, { status: 500 });
    } else {
      // Handle unknown error types
      return NextResponse.json(
        { message: 'An unknown error occurred.' },
        { status: 500 }
      );
    }
  }
}
