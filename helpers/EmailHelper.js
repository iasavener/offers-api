const axios = require("axios");

const EmailHelper = {
    async sendEmail (authToken, to, category, metadata, attachment) {
        const formData = new FormData();
    
            formData.append("to", JSON.stringify(to));
            formData.append("category", category);
            if (metadata) {
                formData.append(
                "metadata",
                JSON.stringify(metadata)
                );
            }

            if (attachment) {
                const fileContent = await fs.readFile(attachment.path);
        
                formData.append(
                  "attachment",
                  new Blob([fileContent]),
                  attachment.originalname
                );
              }
        
    
            await axios.post("http://127.0.0.1:3002/notify-employees", formData, {
            headers: {
                Authorization: authToken,
            },
            proxy: false,
            });
            return {};
    },
  };
  
  module.exports = EmailHelper;
