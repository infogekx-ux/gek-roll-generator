// oplevering.js - Completion report engine
// Owner creates report with photos (and notes), sends link to client.
// Client opens link, reviews before/after photos, approves -> restant invoice activates.

const Oplevering = {
  config: null,

  init(config) { this.config = config; },

  // Get or create the oplevering subtree on an offerte
  ensure(offerteId) {
    const doc = Storage.getById(offerteId, 'offerte');
    if (!doc) return null;
    if (!doc.oplevering) {
      const id = 'OPL-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 900) + 100);
      doc.oplevering = {
        id,
        date: new Date().toISOString().slice(0, 10),
        photos: [],
        notes: '',
        status: 'concept',
        sent_at: null,
        opened_at: null,
        checkbox_at: null,
        decision: null,
        decision_at: null,
        decision_note: null,
        user_agent: null
      };
      Storage.upsert(doc, 'offerte');
    }
    return doc;
  },

  addPhoto(offerteId, dataUrl, filename, description) {
    const doc = this.ensure(offerteId);
    if (!doc) return;
    doc.oplevering.photos.push({
      filename: filename || ('photo_' + Date.now() + '.jpg'),
      dataUrl,
      description: description || '',
      added_at: new Date().toISOString()
    });
    Storage.upsert(doc, 'offerte');
  },

  removePhoto(offerteId, index) {
    const doc = Storage.getById(offerteId, 'offerte');
    if (!doc?.oplevering) return;
    doc.oplevering.photos.splice(index, 1);
    Storage.upsert(doc, 'offerte');
  },

  updatePhotoDescription(offerteId, index, description) {
    const doc = Storage.getById(offerteId, 'offerte');
    if (!doc?.oplevering) return;
    if (doc.oplevering.photos[index]) {
      doc.oplevering.photos[index].description = description;
      Storage.upsert(doc, 'offerte');
    }
  },

  updateNotes(offerteId, notes) {
    const doc = Storage.getById(offerteId, 'offerte');
    if (!doc?.oplevering) return;
    doc.oplevering.notes = notes;
    Storage.upsert(doc, 'offerte');
  },

  send(offerteId) {
    const doc = Storage.getById(offerteId, 'offerte');
    if (!doc?.oplevering) return null;
    doc.oplevering.status = 'sent';
    doc.oplevering.sent_at = new Date().toISOString();
    Storage.upsert(doc, 'offerte');
    return doc;
  },

  markOpened(offerteId) {
    const doc = Storage.getById(offerteId, 'offerte');
    if (!doc?.oplevering) return null;
    if (!doc.oplevering.opened_at) {
      doc.oplevering.opened_at = new Date().toISOString();
      Storage.upsert(doc, 'offerte');
    }
    return doc;
  },

  markCheckbox(offerteId) {
    const doc = Storage.getById(offerteId, 'offerte');
    if (!doc?.oplevering) return null;
    doc.oplevering.checkbox_at = new Date().toISOString();
    Storage.upsert(doc, 'offerte');
    return doc;
  },

  markDecision(offerteId, decision, note) {
    const doc = Storage.getById(offerteId, 'offerte');
    if (!doc?.oplevering) return null;
    doc.oplevering.decision = decision;
    doc.oplevering.decision_at = new Date().toISOString();
    doc.oplevering.status = decision;
    doc.oplevering.user_agent = navigator.userAgent;
    if (note) doc.oplevering.decision_note = note;
    Storage.upsert(doc, 'offerte');

    // On approval: activate the restant invoice (final invoice)
    if (decision === 'approved' && Array.isArray(doc.generatedInvoices)) {
      // The 2nd generated invoice is the restant (created by Offerte.splitInvoice)
      const restantId = doc.generatedInvoices[1];
      if (restantId) {
        const restant = Storage.getById(restantId, 'factuur');
        if (restant) {
          restant.status = 'open';
          restant.activatedByOplevering = true;
          restant.activatedAt = new Date().toISOString();
          // Reset date to activation day so paymentDays counts from now
          restant.date = new Date().toISOString().slice(0, 10);
          Storage.upsert(restant, 'factuur');
        }
      }
    }
    return doc;
  }
};

window.Oplevering = Oplevering;
