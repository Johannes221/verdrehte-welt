const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    // References
    bestellungId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
        index: true
    },
    eventId: {
        type: String,
        required: true,
        index: true
    },
    ticketVarianteId: String,
    
    // Ticket Info
    bezeichnung: String,
    preis: Number,
    kaeuferEmail: {
        type: String,
        required: true
    },
    
    // QR Code
    qrToken: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    qrCodeUrl: String, // Cloudinary URL
    
    // Status
    status: {
        type: String,
        enum: ['gueltig', 'eingelassen', 'erstattet', 'gesperrt'],
        default: 'gueltig',
        index: true
    },
    
    // Check-in History
    scanHistorie: [{
        zeitpunkt: Date,
        deviceId: String,
        modus: {
            type: String,
            enum: ['tuer', 'abendkasse', 'manuell']
        }
    }],
    
    // Timestamps
    generiert_at: {
        type: Date,
        default: Date.now
    },
    erstverwendung_at: Date
}, {
    timestamps: true
});

// Indexes
ticketSchema.index({ eventId: 1, status: 1 });
ticketSchema.index({ qrToken: 1 }, { unique: true });

module.exports = mongoose.model('Ticket', ticketSchema);
