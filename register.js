const crypto = require('crypto');
const qs = require('qs');
const http2 = require('http2');

const domain = "member.naelike.com"

const fetch = (method,path,payload=null,cookie=null) => new Promise((resolve) => {
	const client = http2.connect(`https://${domain}`);
	const req = client.request({
		":authority": domain,
		":scheme": "https",
		":method": method,
		":path":path,
		"content-type": "application/x-www-form-urlencoded",
		"referrer": `https://${domain}/register`,
		"cookie":cookie,
		"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36 Edg/92.0.902.84"
	});
	let data = [];
	let headers = null;
	req.on('data', (chunk) => {
		data.push(chunk);
	});
	req.on('end', () => {
		return resolve({data:data.join(""),headers:headers});
	});
	req.on('response', (response)=> {
		headers = JSON.parse(JSON.stringify(response));
	});
	req.setEncoding('utf8');
	if (payload != null) {
		req.write(Buffer.from(payload));
	}
	req.end();
})
const md5 = (s) => crypto.createHash('md5').update(s).digest('hex');

function getRandomInRange(from, to, fixed) {
    return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
}

async function GetSessionID() {
    let res = await fetch("GET","/getbeamed")
    let cookie = (res.headers['set-cookie'][0]||'').match(/(?<=_S_e_Ss_Io_N-__NlSesS=)[\w\d]+/)
    return cookie
}

function GenerateFingerprint() {
    let latitude = getRandomInRange(-180, 180, 4),longitude = getRandomInRange(-180, 180, 4)

    let location=latitude+','+longitude+'_S_e_Ss_Io_N-__NlMmb';
    let md5_location=md5(location);

    return {cookie : `_se__SiO_n_gPsIn=${md5_location}; Us_E_R_Nam_e_GpsIN=${md5(md5_location+'1')}; Ss_eNNAS_GpsIN=${md5(md5_location+'2')}; GP_s_lL_GpsIN=${md5(md5_location+'3')};`,latitude,longitude}
}

async function register(username,email,password,phone) {
	const register_fingerprint = await GenerateFingerprint()
	const session_id = await GetSessionID()
	let a = await fetch("POST","/register/do_register", qs.stringify({username: username,email: email,phone: phone,password: password,password_confirm: password,gps: `${register_fingerprint.latitude},${register_fingerprint.longitude}`}),register_fingerprint.cookie + ` _S_e_Ss_Io_N-__NlMmb=${session_id}`)
	console.log(JSON.parse(a.data))
}

register("chasdanios","chanasdios@github.com","chaddaasdanios1234","0584630213")
