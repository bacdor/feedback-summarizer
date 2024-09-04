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
      message: 'PDF uploaded successfully',
      text: textContent.text
    });
  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json(
      { message: 'Failed to process file', error: 'error' },
      { status: 500 }
    );
  }
}

// app/api/parse-pdf/route.ts
// import { NextResponse } from 'next/server';
// import pdfParse from 'pdf-parse';

// export async function POST(request: Request) {
//   // const fileBuffer = await request.arrayBuffer();
//   // const data = await pdfParse(Buffer.from(fileBuffer));
//   const data = 'TEST';

//   return NextResponse.json({ text: data });
// }

// import { createClient } from '@/utils/supabase/server';
// import { NextResponse } from 'next/server';
// import { NextRequest } from 'next/server';
// import { getErrorRedirect, getStatusRedirect } from '@/utils/helpers';
// import pdfParse from 'pdf-parse';

// export async function POST(request: NextRequest) {
//   // Example of parsing the request and doing something with it
//   // const fileBuffer = await request.arrayBuffer();
//   // const data = await pdfParse(Buffer.from(fileBuffer));
//   const requestUrl = new URL(request.url);

//   // Redirect with query parameters
//   return NextResponse.redirect('/');
// }

// export async function GET(request: NextRequest) {
//   // The `/auth/callback` route is required for the server-side auth flow implemented
//   // by the `@supabase/ssr` package. It exchanges an auth code for the user's session.
//   const requestUrl = new URL(request.url);
//   const code = requestUrl.searchParams.get('code');

//   if (code) {
//     const supabase = createClient();

//     const { error } = await supabase.auth.exchangeCodeForSession(code);

//     if (error) {
//       return NextResponse.redirect(
//         getErrorRedirect(
//           `${requestUrl.origin}/signin/forgot_password`,
//           error.name,
//           "Sorry, we weren't able to log you in. Please try again."
//         )
//       );
//     }
//   }

//   // URL to redirect to after sign in process completes
//   return NextResponse.redirect(
//     getStatusRedirect(
//       `${requestUrl.origin}/signin/update_password`,
//       'You are now signed in.',
//       'Please enter a new password for your account.'
//     )
//   );
// }
