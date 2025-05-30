const express = require('express');
const { google } = require('googleapis');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const auth = new google.auth.GoogleAuth({
  keyFile: 'credentials.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const spreadsheetId = '1QvDYWwWs4_rnuwzO1mku_6nQgEe09rA6DgEaSAeMYEs'; // Masalan: 1fFh...bnWg

app.post('/users', async (req, res) => {
  const { name, phone, message } = req.body;

  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'flexusers!A:D',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[name, phone, message, new Date()]],
      },
    });

    res.status(200).send({ success: true, message: 'Jo‘natildi!' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, error: 'Xatolik' });
  }
});

app.listen(3000, () => console.log('Server 3000-portda ishlayapti'));
