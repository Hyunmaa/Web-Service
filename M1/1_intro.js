// CODESHARE : https://codeshare.io/wsinf2024

var a = 1;
console.log(a);

let b = 2;
console.log(b);

const c = 3;
console.log(c);

let kata1 = "halo selamat datang di JS";
let kata2 = "ada";
console.log(kata1 + kata2);
console.log(`Contohnya adalah ${kata1} dan ${kata2}`);

let angka = 3;

if (angka < 15) {
  console.log("Dibawah 15");
} else if (angka < 50) {
  console.log("Dibawah 50");
} else {
  console.log("Diatas 50");
}

for (let i = 0; i < angka; i++) {
  console.log(`For urutan ke : ${i}`);
}

//=====================================//

let mhs = {
  nama: "Mimi",
  umur: 45,
  jk: "pria",
  lahir: {
    tanggal: "2022-02-03",
    tempat: "Indonesia",
  },
  favoriteAnime: [1, 3],
  anime: [
    {
      id: 1,
      namaAnime: "Jojo",
      tahunRilis: 2000,
      publisher: "Bandai Namco",
    },
    {
      id: 2,
      namaAnime: "Attack on Titan",
      tahunRilis: 2019,
    },
    {
      id: 3,
      namaAnime: "Kamitsu No Yaiba",
      tahunRilis: 2023,
    },
  ],
};

console.log(mhs);
console.log(mhs.nama);
console.log(mhs.lahir.tanggal);
console.log(mhs.anime[1].namaAnime);
// pertanyaan dunstan ambil anime yang ID 1
let animeDunstan = [];
// untuk setiap barang/data dalam tas saya / array saya
for (const anime of mhs.anime) {
  if (mhs.favoriteAnime.includes(anime.id)) {
    animeDunstan.push(anime);
  }
}
console.log("Tapi anime yang dicari dunstan");
console.log(animeDunstan);

const arrContoh = [1, 2, 3];
// const arrHasilMap arrContoh.map((data) => data + 1);
const arrHasilMap = arrContoh.map(function (data) {
  return data + 1;
});
console.log(arrHasilMap);
