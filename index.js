const express = require('express');
const { google } = require('googleapis');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Faqat api.flexenergy.uz dan so'rovlarni qabul qilamiz
app.use(cors({
  origin: ["http://localhost:5173", "https://flexenergy.uz"],
  methods: ["GET", "POST"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(bodyParser.json());

const auth = new google.auth.GoogleAuth({
  keyFile: 'credentials.json',       // Bu fayl serverda bo'lishi kerak
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const spreadsheetId = '1QvDYWwWs4_rnuwzO1mku_6nQgEe09rA6DgEaSAeMYEs';

app.post('/users', async (req, res) => {
  const { name, phone, message } = req.body;

  if (!name || !phone || !message) {
    return res.status(400).send({ success: false, error: 'name, phone va message maydonlari to‘ldirilishi kerak' });
  }

  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'flexusers!A:D',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[name, phone, message, new Date().toISOString()]],
      },
    });

    res.status(200).send({ success: true, message: 'Jo‘natildi!' });
  } catch (err) {
    console.error('Google Sheets API xatosi:', err);
    res.status(500).send({ success: false, error: 'Serverda xatolik yuz berdi' });
  }
});

// Server porti (Heroku yoki shunga o'xshash platformalar uchun process.env.PORT)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server ${PORT}-portda ishlayapti`);
});
