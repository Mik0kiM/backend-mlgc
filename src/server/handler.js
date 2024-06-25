const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../services/storeData');

async function postPredictHandler(request, h) {
  try {
    if (request.payload.image.byteLength > 1000000) { // Check if the image size exceeds 1MB
      return h.response({
        status: 'fail',
        message: 'Payload content length greater than maximum allowed: 1000000'
      }).code(413);
    }

    const { image } = request.payload;
    const { model } = request.server.app;

    const { confidenceScore, label } = await predictClassification(model, image);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const suggestion = label === 'Cancer' ? "Segera periksa ke dokter!" : "Risiko rendah, tetap monitor kondisi.";

    const data = {
      id: id,
      result: label,
      suggestion: suggestion,
      createdAt: createdAt
    }

    await storeData(id, data);

    const response = h.response({
      status: 'success',
      message: 'Model is predicted successfully',
      data: data
    });
    response.code(201);
    return response;
  } catch (error) {
    return h.response({
      status: 'fail',
      message: 'Terjadi kesalahan dalam melakukan prediksi'
    }).code(400);
  }
}

module.exports = postPredictHandler;
