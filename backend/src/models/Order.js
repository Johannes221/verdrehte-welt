const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    // Buyer Info
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    vorname: String,
    nachname: String,
    
    // Event Reference
    eventId: {
        type: String,
        required: true,
        index: true
    },
    
    // Order Items
    positionen: [{
        ticketVarianteId: String,
        bezeichnung: String,
        einzelpreisBrutto: Number,
        menge: Number,
        summe: Number
    }],
    
    // Pricing
    summeBrutto: {
        type: Number,
        required: true
    },
    plattformFee: {
        type: Number,
        default: 0
    },
    waehrung: {
        type: String,
        default: 'EUR'
    },
    
    // Status
    status: {
        type: String,
        enum: ['offen', 'pending', 'bezahlt', 'completed', 'erstattet', 'abgebrochen', 'expired'],
        default: 'offen',
        index: true
    },
    
    // PayPal
    paypalOrderId: {
        type: String,
        index: true,
        sparse: true
    },
    paypalCaptureId: {
        type: String,
        unique: true,
        sparse: true
    },
    
    // Legal
    agbAkzeptiert: {
        type: Boolean,
        required: true
    },
    dsgvoAkzeptiert: {
        type: Boolean,
        required: true
    },
    widerrufsbelehrungGelesen: {
        type: Boolean,
        required: true
    },
    
    // Timestamps
    erstellt_at: {
        type: Date,
        default: Date.now
    },
    bezahlt_at: Date,
    
    // Payout
    payoutStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },
    payoutDate: Date,
    payoutBatchId: String
}, {
    timestamps: true
});

// Indexes
orderSchema.index({ email: 1, eventId: 1 });
orderSchema.index({ erstellt_at: -1 });

module.exports = mongoose.model('Order', orderSchema);
