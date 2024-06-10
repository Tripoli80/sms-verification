export const sms = async (code: string, phone: string) => {
  const token = process.env.SMSTOKEN;
  const url = 'https://im.smsclub.mobi/sms/send';

  const data = {
    phone: [phone],
    message: code + ' - CODE VERIFICATION ',
    src_addr: 'VashZakaz',
  };

  fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(response => response.json())
    .then(result => {
      console.log(result);
    })
    .catch(error => {
      console.error('Error:', error);
    });
};
