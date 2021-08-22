const crypto = require('crypto');
const fetch = require('node-fetch');
const qs = require('qs');

const md5 = (s) => crypto.createHash('md5').update(s).digest('hex');

async function register(username,email,password,phone) {
    const register_fingerprint = await GenerateLoginFingerprint()
    const session_id = await GetSessionID()
    return fetch("https://member.naelike.com/register/do_register",{
        "method": "POST",
        "headers": {
            "content-type": "application/x-www-form-urlencoded",
            "cookie": register_fingerprint.cookie + ` _S_e_Ss_Io_N-__NlMmb=${session_id}`
        },
        "body": qs.stringify({
            username: username,
            email: email,
            phone: phone,
            password: password,
            password_confirm: password,
            gps: `${register_fingerprint.latitude},${register_fingerprint.longitude}`
        }),
    }).then(res => res.text()).then(console.log)
}
async function GetSessionID() {
    let res = await fetch("https://member.naelike.com/getbeamed",{
        follow: 0
    })
    let cookie = (res.headers.get('set-cookie')||'').match(/(?<=_S_e_Ss_Io_N-__NlSesS=)[\w\d]+/)
    if(!cookie) throw Error("CF_MAYBE?")
    return cookie[0]
}
function GenerateLoginFingerprint() {
    let latitude = Math.random()
    let longitude = Math.random()

    let location=latitude+','+longitude+'_S_e_Ss_Io_N-__NlMmb';
    let md5_location=md5(location);

    return {
        cookie : `_se__SiO_n_gPsIn=${md5_location}; Us_E_R_Nam_e_GpsIN=${md5(md5_location+'1')}; Ss_eNNAS_GpsIN=${md5(md5_location+'2')}; GP_s_lL_GpsIN=${md5(md5_location+'3')};`,
        latitude,longitude
    }
}

register("chanios","chanios@github.com","chadasdanios1234","0584930213")
