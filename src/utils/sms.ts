export const sms = async (code: string, phone: string, alfa?: string) => {
  // console.log("🚀 ~ code:", code)
  // return
  const token = process.env.SMSTOKEN;
  const url = 'https://im.smsclub.mobi/sms/send';

  const data = {
    phone: [phone],
    message: code + ' - CODE VERIFICATION ',
    src_addr: alfa ? alfa : process.env.ALFA,
  };
  // console.log("🚀 ~ data:", data)
  // return

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
      return !!result;
    })
    .catch(error => {
      console.error('Error:', error);
      return false;
    });
};
