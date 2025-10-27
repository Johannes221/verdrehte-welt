// Quick Email Test Script
require('dotenv').config();
const { Resend } = require('resend');

async function testEmail() {
    console.log('=== EMAIL TEST ===');
    console.log('MAIL_API_KEY:', process.env.MAIL_API_KEY ? 'SET (length: ' + process.env.MAIL_API_KEY.length + ')' : 'NOT SET');
    console.log('MAIL_FROM:', process.env.MAIL_FROM);
    
    if (!process.env.MAIL_API_KEY) {
        console.error('❌ MAIL_API_KEY not set!');
        return;
    }
    
    const resend = new Resend(process.env.MAIL_API_KEY);
    
    try {
        console.log('\nSending test email...');
        const data = await resend.emails.send({
            from: process.env.MAIL_FROM || 'noreply@verdrehte-welt.com',
            to: 'johannes.schartl@gmail.com',
            subject: '🧪 Test Email von Verdrehte Welt',
            html: '<h1>Test Email</h1><p>Wenn du das siehst, funktioniert Resend!</p>'
        });
        
        console.log('✅ Email sent!');
        console.log('Email ID:', data.id);
        console.log('\nCheck https://resend.com/emails für Details!');
    } catch (error) {
        console.error('❌ Email Error:', error.message);
        console.error('Full error:', error);
    }
}

testEmail();
