"use strict";

const nodemailer = require('nodemailer');

var _email = {
    outputHtml: (data) => {
        var output = '<p>You have a new contact request</p>';
        output += '<h3>Contact Details</h3>';
        output += '<ul>'
        output += ' <li>Name: '+ data.name +'</li>';
        output += ' <li>Email: '+ data.email +' </li>';
        output += '</ul>';
        output += '<h3>Message</h3>'
        output += '<p>'+ data.message +'</p>';

        return output;
    },

    sendEmail : (req, res) => {
        let output = _email.outputHtml(req.body);
        
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: "jcobportfolio@gmail.com", 
                pass: "6LcF7jcaAAAAAKUxno" 
            }
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: req.body.email, 
            to: "jcaleb.obastos@gmail.com", 
            subject: 'Portolio Contact Message', 
            html: output 
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);   
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            // res.render('contact', { layout: false, message:'Email has been sent'});
            return res.status(200).send({
                status: "success",
                message: 'Email has been sent'
            });
        });
    }
} // end email controller

module.exports = _email;