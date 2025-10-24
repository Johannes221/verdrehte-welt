#!/usr/bin/env node
require('dotenv').config();
const mongoose = require('mongoose');
const { generateTicketsForOrder } = require('./src/services/ticketGeneration');

async function run() {
    try {
        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connected\n');
        
        // Find paid orders without tickets
        const Order = require('./src/models/Order');
        const Ticket = require('./src/models/Ticket');
        
        const paidOrders = await Order.find({ status: 'bezahlt' });
        console.log(`📋 Found ${paidOrders.length} paid orders\n`);
        
        for (const order of paidOrders) {
            const existingTickets = await Ticket.find({ bestellungId: order._id });
            
            if (existingTickets.length > 0) {
                console.log(`⏭️  Order ${order._id} already has ${existingTickets.length} tickets`);
                continue;
            }
            
            console.log(`🎫 Generating tickets for Order: ${order._id}`);
            console.log(`   Email: ${order.email}`);
            console.log(`   Event: ${order.eventId}`);
            
            try {
                const tickets = await generateTicketsForOrder(order._id.toString());
                console.log(`   ✅ Generated ${tickets.length} ticket(s)\n`);
            } catch (error) {
                console.error(`   ❌ Failed: ${error.message}\n`);
            }
        }
        
        // Show summary
        const totalTickets = await Ticket.countDocuments();
        const checkedIn = await Ticket.countDocuments({ status: 'eingecheckt' });
        const valid = await Ticket.countDocuments({ status: 'gueltig' });
        
        console.log('📊 Summary:');
        console.log(`   Total Tickets: ${totalTickets}`);
        console.log(`   Valid: ${valid}`);
        console.log(`   Checked In: ${checkedIn}`);
        
        await mongoose.connection.close();
        console.log('\n✅ Done!');
        
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

run();
