const express = require('express');
const app = express();
//---------------------------------//
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let users = [];
let jadwalList = [];
let jadwalCtr = 1;


// NO 1
app.post('/api/user', (req, res) => {
    const { username, password, confirmPassword, role, display_name, date_of_birth } = req.body
    
    let filterUser = users.find(user => user.username == username)
    if(filterUser){
        return res.status(400).send({message: "Username telah terdaftar!"})
    }

    if(!username || !password)
    {
        return res.status(400).send({ message: "Username dan password wajib diisi" });
    }
    if(!role ){
        return res.status(400).send({ message: "Role wajib diisi" })
    }
    if(password != confirmPassword)
    {
        return res.status(400).send({ message: "Confirm password harus sama dengan password" })
    }
    if(role != "Manager" && role != "Pegawai")
    {
        return res.status(400).send({ message: "Role hanya bisa Pegawai atau Manager" })
    }
    const dobRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if(!dobRegex.test(date_of_birth))
    {
        return res.status(400).send({ message: "Format date tidak sesuai" })
    }

    
    const newUser = { username, password, role, display_name, date_of_birth }
    users.push(newUser)
    res.status(201).json({
        username: newUser.username,
        role: newUser.role,
        display_name: newUser.display_name,
        date_of_birth: newUser.date_of_birth,
        message: `User ${newUser.display_name} telah dibuat!`
    })
})



// No.2
app.get('/api/user/pegawai', (req, res) => {
    const { nama } = req.query
    let filterUser = users.filter(user => user.role == "Pegawai")

    if(nama)
    {
        filterUser = filterUser.filter(user => user.username.toLowerCase() == nama.toLowerCase());
    }

    res.status(200).json({
        users: filterUser
    })
})


// No.3
app.get('/api/user/manager', (req, res) => {
    const { nama } = req.query
    let filterUser = users.filter(user => user.role == "Manager")

    if(nama)
    {
        filterUser = filterUser.filter(user => user.username.toLowerCase() == nama.toLowerCase())
    }

    res.status(200).json({
        user: filterUser
    })
})


// No.4
app.delete('/api/user', (req, res) => {
    const { username } = req.body
    const cariUser = users.findIndex(user => user.username == username)

    if(cariUser == -1)
    {
        return res.status(404).json({ message: `Username ${username} tidak terdaftar!` })
    }

    const deletedUser = users.splice(cariUser, 1)[0]
    res.status(200).json({ message: `${deletedUser.role} ${deletedUser.username}, telah dihapus` })
})


// No.5
app.post('/api/jadwal', (req, res) => {
    const { username, password, tanggal, judul, prioritas } = req.body

    if(!username || !password || !tanggal || !judul || !prioritas)
    {
        res.status(400).send({ message: "Semua field harus diisi" })
    }

    const user = users.find(u => u.username == username && u.password == password)
    if(!user)
    {
        return res.status(400).send({ message: "Username dan password tidak sesuai" })
    }
    if(user.role != "Pegawai")
    {
        return res.status(400).send({ message: "Hanya pegawai yang bisa membuat jadwal" })
    }
    if(prioritas < 1 || prioritas > 10)
    {
        return res.status(400).send({ message: "Prioritas harus 1-10" })
    }

    const today = new Date("2025-03-12")
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/
    if(!dateRegex.test(tanggal))
    {
        return res.status(400).send({ message: "Tanggal tidak valid" })
    }

    const [day, month, year] = tanggal.split('/').map(num => parseInt(num, 10));
    const inputDate = new Date(year, month - 1, day);
    if (inputDate.getDate() != day || inputDate.getMonth() + 1 != month || inputDate.getFullYear() != year)
    {
        return res.status(400).json({ message: "Tanggal tidak valid" });
    }

    if(inputDate <= today)
    {
        return res.status(400).send({ message: "Tanggal tidak valid" })
    }
    if(!judul.trim())
    {
        return res.status(400).send({ message: "Judul harus diisi" })
    }

    const jadwal_id = `JD${String(jadwalCtr++).padStart(4, '0')}`
    const newJadwal = { jadwal_id, tanggal, judul, prioritas, status: "Belum dikonfirmasi" }
    jadwalList.push(newJadwal)

    res.status(200).json({
        jadwal_id: newJadwal.jadwal_id,
        tanggal: newJadwal.tanggal,
        judul: newJadwal.judul,
        prioritas: newJadwal.prioritas,
        status: newJadwal.status,
        message: `Jadwal baru untuk ${username} telah dibuat!`
    })
})

//No 6
app.get('/api/jadwal/', (req, res) => {
    const { tanggal } = req.query
    const filterJadwal = jadwalList.filter(jadwal => jadwal.tanggal == tanggal)

    if(filterJadwal.length == 0)
    {
        return res.status(200).json({ jadwal: [] })
    }

    res.status(200).json({ jadwal: filterJadwal })
})

//No 7
app.delete('/api/jadwal', (req, res) => {
    const { jadwal_id } = req.body
    console.log("Cari jadwal ID: ", jadwal_id)
    console.log("Daftar Jadwal:", jadwalList);
    const index = jadwalList.findIndex(jadwal => jadwal.jadwal_id == jadwal_id);

    if(index == -1)
    {
        return res.status(404).send({ message: "Jadwal tidak ditemukan" })
    }

    const deleteJadwal = jadwalList.splice(index, 1)[0]
    res.status(200).json({ message: `Jadwal ${deleteJadwal.judul} telah dihapus` })
})

//No 8
app.post('/api/jadwal/confirmation', (req, res) => {
    const { jadwal_id, username, password } = req.body
    const user = users.find(u => u.username == username && u.password == password)

    if(!user || user.role != "Manager")
    {
        return res.status(404).send({ message: "Credentials Manager salah" })
    }

    const jadwal = jadwalList.find(j => j.jadwal_id == jadwal_id)
    if(!jadwal)
    {
        return res.status(404).send({ message: "Jadwal tidak ditemukan" })
    }
    if(jadwal.status == "Terkonfirmasi")
    {
        return res.status(404).send({ message: "Jadwal sudah terkonfirmasi" })
    }

    jadwal.status = "Terkonfirmasi"
    res.status(200).json({ message: `Jadwal ${jadwal.judul} telah dikonfirmasi` })
})

//------------------------------------------------------------------//
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});