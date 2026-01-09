// Check sent emails in Resend
require('dotenv').config();
const { Resend } = require('resend');

async function checkResentEmails() {
    try {
        const resend = new Resend(process.env.MAIL_API_KEY);
        
        console.log('[Resend] Fetching recent emails...\n');
        
        const emails = await resend.emails.list({ limit: 10 });
        
        if (emails.data && emails.data.length > 0) {
            console.log(`[Resend] Found ${emails.data.length} recent emails:\n`);
            
            emails.data.forEach((email, i) => {
                console.log(`${i + 1}. Email ID: ${email.id}`);
                console.log(`   From: ${email.from}`);
                console.log(`   To: ${email.to}`);
                console.log(`   Subject: ${email.subject}`);
                console.log(`   Status: ${email.last_event || 'unknown'}`);
                console.log(`   Created: ${email.created_at}`);
                console.log('');
            });
        } else {
            console.log('[Resend] No emails found');
        }
        
    } catch (error) {
        console.error('[Resend] Error:', error.message);
        if (error.statusCode === 422) {
            console.error('\n⚠️  WICHTIG: Die Absender-Domain ist nicht verifiziert!');
            console.error('Lösung: Nutze onboarding@resend.dev als Absender oder verifiziere deine Domain.');
        }
    }
}

checkResentEmails();
