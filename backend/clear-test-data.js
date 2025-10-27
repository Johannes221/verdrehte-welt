#!/usr/bin/env node

/**
 * CLEAR TEST DATA SCRIPT
 * 
 * Dieses Script löscht ALLE Tickets und Bestellungen aus der Production-Datenbank
 * 
 * ACHTUNG: Kann nicht rückgängig gemacht werden!
 */

require('dotenv').config();
const mongoose = require('mongoose');

async function clearTestData() {
    try {
        console.log('🔄 Verbinde mit MongoDB...');
        
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log('✅ Verbunden!\n');
        
        // Import Models
        const Order = require('./src/models/Order');
        const Ticket = require('./src/models/Ticket');
        
        // Count before
        const ticketCount = await Ticket.countDocuments();
        const orderCount = await Order.countDocuments();
        
        console.log(`📊 Gefunden:`);
        console.log(`   - ${ticketCount} Tickets`);
        console.log(`   - ${orderCount} Bestellungen\n`);
        
        if (ticketCount === 0 && orderCount === 0) {
            console.log('✅ Datenbank ist bereits leer!\n');
            process.exit(0);
        }
        
        // Confirmation
        console.log('⚠️  WARNUNG: Dies löscht ALLE Daten!\n');
        console.log('Drücke Ctrl+C um abzubrechen...');
        console.log('Starte in 3 Sekunden...\n');
        
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Delete
        console.log('🗑️  Lösche Tickets...');
        const deletedTickets = await Ticket.deleteMany({});
        console.log(`✅ ${deletedTickets.deletedCount} Tickets gelöscht`);
        
        console.log('🗑️  Lösche Bestellungen...');
        const deletedOrders = await Order.deleteMany({});
        console.log(`✅ ${deletedOrders.deletedCount} Bestellungen gelöscht\n`);
        
        console.log('🎉 Fertig! Datenbank ist jetzt leer und bereit für Production!\n');
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Fehler:', error.message);
        process.exit(1);
    }
}

clearTestData();
