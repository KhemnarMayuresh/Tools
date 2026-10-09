// Stable built-in prompt inventory. All references are local.
const defaultSelectedCategories = ["Marvel","DC","Doraemon","Shinchan","Chhota_Bheem"];
const data = [
  {
    "name": "Iron Man",
    "imageUrl": "./images/Iron_Man.jpg",
    "category": "Marvel",
    "id": "prompt-1",
    "categoryId": "category-1",
    "categoryName": "Marvel"
  },
  {
    "name": "Captain America",
    "imageUrl": "./images/Captain_America.jpg",
    "category": "Marvel",
    "id": "prompt-2",
    "categoryId": "category-1",
    "categoryName": "Marvel"
  },
  {
    "name": "SpiderMan",
    "imageUrl": "./images/SpiderMan.png",
    "category": "Marvel",
    "id": "prompt-3",
    "categoryId": "category-1",
    "categoryName": "Marvel"
  },
  {
    "name": "Deadpool",
    "imageUrl": "./images/Deadpool.png",
    "category": "Marvel",
    "id": "prompt-4",
    "categoryId": "category-1",
    "categoryName": "Marvel"
  },
  {
    "name": "Thor",
    "imageUrl": "./images/Thor.png",
    "category": "Marvel",
    "id": "prompt-5",
    "categoryId": "category-1",
    "categoryName": "Marvel"
  },
  {
    "name": "Hulk",
    "imageUrl": "./images/Hulk.jpg",
    "category": "Marvel",
    "id": "prompt-6",
    "categoryId": "category-1",
    "categoryName": "Marvel"
  },
  {
    "name": "Black Widow",
    "imageUrl": "./images/Black Widow.png",
    "category": "Marvel",
    "id": "prompt-7",
    "categoryId": "category-1",
    "categoryName": "Marvel"
  },
  {
    "name": "Ant Man",
    "imageUrl": "./images/Ant Man.png",
    "category": "Marvel",
    "id": "prompt-8",
    "categoryId": "category-1",
    "categoryName": "Marvel"
  },
  {
    "name": "Dr. Strange",
    "imageUrl": "./images/Doctor-Strange.png",
    "category": "Marvel",
    "id": "prompt-9",
    "categoryId": "category-1",
    "categoryName": "Marvel"
  },
  {
    "name": "Hawkeye",
    "imageUrl": "./images/Hawkeye.png",
    "category": "Marvel",
    "id": "prompt-10",
    "categoryId": "category-1",
    "categoryName": "Marvel"
  },
  {
    "name": "Black Panther",
    "imageUrl": "./images/Black Panther.jpg",
    "category": "Marvel",
    "id": "prompt-11",
    "categoryId": "category-1",
    "categoryName": "Marvel"
  },
  {
    "name": "Wanda Maximoff",
    "imageUrl": "./images/Wanda Maximoff.png",
    "category": "Marvel",
    "id": "prompt-12",
    "categoryId": "category-1",
    "categoryName": "Marvel"
  },
  {
    "name": "Loki",
    "imageUrl": "./images/Loki.png",
    "category": "Marvel",
    "id": "prompt-13",
    "categoryId": "category-1",
    "categoryName": "Marvel"
  },
  {
    "name": "Thanos",
    "imageUrl": "./images/Thanos.png",
    "category": "Marvel",
    "id": "prompt-14",
    "categoryId": "category-1",
    "categoryName": "Marvel"
  },
  {
    "name": "Wolverine",
    "imageUrl": "./images/Wolverine.png",
    "category": "Marvel",
    "id": "prompt-15",
    "categoryId": "category-1",
    "categoryName": "Marvel"
  },
  {
    "name": "Batman",
    "imageUrl": "./images/Batman.png",
    "category": "DC",
    "id": "prompt-16",
    "categoryId": "category-2",
    "categoryName": "DC"
  },
  {
    "name": "Superman",
    "imageUrl": "./images/Superman.png",
    "category": "DC",
    "id": "prompt-17",
    "categoryId": "category-2",
    "categoryName": "DC"
  },
  {
    "name": "Wonder Woman",
    "imageUrl": "./images/Wonder Women.png",
    "category": "DC",
    "id": "prompt-18",
    "categoryId": "category-2",
    "categoryName": "DC"
  },
  {
    "name": "Flash",
    "imageUrl": "./images/Flash.jpg",
    "category": "DC",
    "id": "prompt-19",
    "categoryId": "category-2",
    "categoryName": "DC"
  },
  {
    "name": "Aquaman",
    "imageUrl": "./images/Aquaman.png",
    "category": "DC",
    "id": "prompt-20",
    "categoryId": "category-2",
    "categoryName": "DC"
  },
  {
    "name": "Joker",
    "imageUrl": "./images/Joker.png",
    "category": "DC",
    "id": "prompt-21",
    "categoryId": "category-2",
    "categoryName": "DC"
  },
  {
    "name": "Doraemon",
    "imageUrl": "./images/Doraemon.png",
    "category": "Doraemon",
    "id": "prompt-22",
    "categoryId": "category-3",
    "categoryName": "Doraemon"
  },
  {
    "name": "Nobita",
    "imageUrl": "./images/Nobita.png",
    "category": "Doraemon",
    "id": "prompt-23",
    "categoryId": "category-3",
    "categoryName": "Doraemon"
  },
  {
    "name": "Shizuka",
    "imageUrl": "./images/Shizuka.png",
    "category": "Doraemon",
    "id": "prompt-24",
    "categoryId": "category-3",
    "categoryName": "Doraemon"
  },
  {
    "name": "Suneo",
    "imageUrl": "./images/Suneo.jpg",
    "category": "Doraemon",
    "id": "prompt-25",
    "categoryId": "category-3",
    "categoryName": "Doraemon"
  },
  {
    "name": "Gian",
    "imageUrl": "./images/Gian.png",
    "category": "Doraemon",
    "id": "prompt-26",
    "categoryId": "category-3",
    "categoryName": "Doraemon"
  },
  {
    "name": "Dorami",
    "imageUrl": "./images/Dorami.png",
    "category": "Doraemon",
    "id": "prompt-27",
    "categoryId": "category-3",
    "categoryName": "Doraemon"
  },
  {
    "name": "Dekisugi",
    "imageUrl": "./images/Dekisugi.jpg",
    "category": "Doraemon",
    "id": "prompt-28",
    "categoryId": "category-3",
    "categoryName": "Doraemon"
  },
  {
    "name": "Shinchan",
    "imageUrl": "./images/Shinchan.png",
    "category": "Shinchan",
    "id": "prompt-29",
    "categoryId": "category-4",
    "categoryName": "Shinchan"
  },
  {
    "name": "Hiroshi",
    "imageUrl": "./images/Hiroshi.png",
    "category": "Shinchan",
    "id": "prompt-30",
    "categoryId": "category-4",
    "categoryName": "Shinchan"
  },
  {
    "name": "Misae",
    "imageUrl": "./images/Misae.png",
    "category": "Shinchan",
    "id": "prompt-31",
    "categoryId": "category-4",
    "categoryName": "Shinchan"
  },
  {
    "name": "himawari",
    "imageUrl": "./images/himawari.png",
    "category": "Shinchan",
    "id": "prompt-32",
    "categoryId": "category-4",
    "categoryName": "Shinchan"
  },
  {
    "name": "Shiro",
    "imageUrl": "./images/Shiro.png",
    "category": "Shinchan",
    "id": "prompt-33",
    "categoryId": "category-4",
    "categoryName": "Shinchan"
  },
  {
    "name": "Ai Chan",
    "imageUrl": "./images/Ai Chan.jpg",
    "category": "Shinchan",
    "id": "prompt-34",
    "categoryId": "category-4",
    "categoryName": "Shinchan"
  },
  {
    "name": "Kazama",
    "imageUrl": "./images/kazama.png",
    "category": "Shinchan",
    "id": "prompt-35",
    "categoryId": "category-4",
    "categoryName": "Shinchan"
  },
  {
    "name": "Boo",
    "imageUrl": "./images/boo.jpg",
    "category": "Shinchan",
    "id": "prompt-36",
    "categoryId": "category-4",
    "categoryName": "Shinchan"
  },
  {
    "name": "Nene",
    "imageUrl": "./images/Nene.jpg",
    "category": "Shinchan",
    "id": "prompt-37",
    "categoryId": "category-4",
    "categoryName": "Shinchan"
  },
  {
    "name": "Masao",
    "imageUrl": "./images/masao.png",
    "category": "Shinchan",
    "id": "prompt-38",
    "categoryId": "category-4",
    "categoryName": "Shinchan"
  },
  {
    "name": "Action Kamen",
    "imageUrl": "./images/Action Kamen.png",
    "category": "Shinchan",
    "id": "prompt-39",
    "categoryId": "category-4",
    "categoryName": "Shinchan"
  },
  {
    "name": "Mickey Mouse",
    "imageUrl": "./images/Mickey Mouse.png",
    "category": "Mickey_Mouse",
    "id": "prompt-40",
    "categoryId": "category-5",
    "categoryName": "Mickey_Mouse"
  },
  {
    "name": "Goofy",
    "imageUrl": "./images/Goofy.png",
    "category": "Mickey_Mouse",
    "id": "prompt-41",
    "categoryId": "category-5",
    "categoryName": "Mickey_Mouse"
  },
  {
    "name": "Pluto",
    "imageUrl": "./images/Pluto.jpg",
    "category": "Mickey_Mouse",
    "id": "prompt-42",
    "categoryId": "category-5",
    "categoryName": "Mickey_Mouse"
  },
  {
    "name": "Chhota Bheem",
    "imageUrl": "./images/Chhota Bheem.png",
    "category": "Chhota_Bheem",
    "id": "prompt-43",
    "categoryId": "category-6",
    "categoryName": "Chhota_Bheem"
  },
  {
    "name": "Chutki",
    "imageUrl": "./images/Chutki.jpg",
    "category": "Chhota_Bheem",
    "id": "prompt-44",
    "categoryId": "category-6",
    "categoryName": "Chhota_Bheem"
  },
  {
    "name": "Rajkumar Indumati",
    "imageUrl": "./images/Rajkumar Indumati.jpg",
    "category": "Chhota_Bheem",
    "id": "prompt-45",
    "categoryId": "category-6",
    "categoryName": "Chhota_Bheem"
  },
  {
    "name": "Raju",
    "imageUrl": "./images/Raju.png",
    "category": "Chhota_Bheem",
    "id": "prompt-46",
    "categoryId": "category-6",
    "categoryName": "Chhota_Bheem"
  },
  {
    "name": "Jaggu",
    "imageUrl": "./images/Jaggu.png",
    "category": "Chhota_Bheem",
    "id": "prompt-47",
    "categoryId": "category-6",
    "categoryName": "Chhota_Bheem"
  },
  {
    "name": "Kalia",
    "imageUrl": "./images/Kalia.jpg",
    "category": "Chhota_Bheem",
    "id": "prompt-48",
    "categoryId": "category-6",
    "categoryName": "Chhota_Bheem"
  },
  {
    "name": "Dholu-Bholu",
    "imageUrl": "./images/Dholu-Bholu.jpg",
    "category": "Chhota_Bheem",
    "id": "prompt-49",
    "categoryId": "category-6",
    "categoryName": "Chhota_Bheem"
  },
  {
    "name": "Shaktimaan",
    "imageUrl": "./images/Shaktimaan.jpeg",
    "category": "Indian_Characters",
    "id": "prompt-50",
    "categoryId": "category-7",
    "categoryName": "Indian_Characters"
  },
  {
    "name": "Hero",
    "imageUrl": "./images/Hero.png",
    "category": "Indian_Characters",
    "id": "prompt-51",
    "categoryId": "category-7",
    "categoryName": "Indian_Characters"
  },
  {
    "name": "Krrish",
    "imageUrl": "./images/Krrish.jpg",
    "category": "Indian_Characters",
    "id": "prompt-52",
    "categoryId": "category-7",
    "categoryName": "Indian_Characters"
  },
  {
    "name": "Modi",
    "imageUrl": "./images/Modi.jpg",
    "category": "Indian_Characters",
    "id": "prompt-53",
    "categoryId": "category-7",
    "categoryName": "Indian_Characters"
  },
  {
    "name": "Dhoni",
    "imageUrl": "./images/Dhoni.jpg",
    "category": "Indian_Characters",
    "id": "prompt-54",
    "categoryId": "category-7",
    "categoryName": "Indian_Characters"
  },
  {
    "name": "Salman",
    "imageUrl": "./images/Salman.png",
    "category": "Indian_Characters",
    "id": "prompt-55",
    "categoryId": "category-7",
    "categoryName": "Indian_Characters"
  },
  {
    "name": "Shahrukh",
    "imageUrl": "./images/Shah-rukh-khan.png",
    "category": "Indian_Characters",
    "id": "prompt-56",
    "categoryId": "category-7",
    "categoryName": "Indian_Characters"
  },
  {
    "name": "Tanjiro Kamado",
    "imageUrl": "./images/Tanjiro_Kamado.png",
    "category": "Demon_Slayer",
    "id": "prompt-57",
    "categoryId": "category-8",
    "categoryName": "Demon_Slayer"
  },
  {
    "name": "Nezuko Kamado",
    "imageUrl": "./images/nezuko.jpg",
    "category": "Demon_Slayer",
    "id": "prompt-58",
    "categoryId": "category-8",
    "categoryName": "Demon_Slayer"
  },
  {
    "name": "Zenitsu Agatsuma",
    "imageUrl": "./images/Zenitsu.png",
    "category": "Demon_Slayer",
    "id": "prompt-59",
    "categoryId": "category-8",
    "categoryName": "Demon_Slayer"
  },
  {
    "name": "Inosuke Hashibira",
    "imageUrl": "./images/Inosuke.png",
    "category": "Demon_Slayer",
    "id": "prompt-60",
    "categoryId": "category-8",
    "categoryName": "Demon_Slayer"
  },
  {
    "name": "Muzan",
    "imageUrl": "./images/Muzan.png",
    "category": "Demon_Slayer",
    "id": "prompt-61",
    "categoryId": "category-8",
    "categoryName": "Demon_Slayer"
  },
  {
    "name": "Akaza",
    "imageUrl": "./images/Akaza.png",
    "category": "Demon_Slayer",
    "id": "prompt-62",
    "categoryId": "category-8",
    "categoryName": "Demon_Slayer"
  },
  {
    "name": "Rengoku",
    "imageUrl": "./images/Rengoku.png",
    "category": "Demon_Slayer",
    "id": "prompt-63",
    "categoryId": "category-8",
    "categoryName": "Demon_Slayer"
  },
  {
    "name": "Muichiro Tokito",
    "imageUrl": "./images/Muichiro_Tokito.png",
    "category": "Demon_Slayer",
    "id": "prompt-64",
    "categoryId": "category-8",
    "categoryName": "Demon_Slayer"
  },
  {
    "name": "Tengen Uzui",
    "imageUrl": "./images/Tengen Uzui.jpg",
    "category": "Demon_Slayer",
    "id": "prompt-65",
    "categoryId": "category-8",
    "categoryName": "Demon_Slayer"
  },
  {
    "name": "Obanai Iguro",
    "imageUrl": "./images/Obanai Iguro.jpg",
    "category": "Demon_Slayer",
    "id": "prompt-66",
    "categoryId": "category-8",
    "categoryName": "Demon_Slayer"
  },
  {
    "name": "Mitsuri Kanroji",
    "imageUrl": "./images/Mitsuri Kanroji.png",
    "category": "Demon_Slayer",
    "id": "prompt-67",
    "categoryId": "category-8",
    "categoryName": "Demon_Slayer"
  },
  {
    "name": "Giyu Tomioka",
    "imageUrl": "./images/Giyu Tomioka.png",
    "category": "Demon_Slayer",
    "id": "prompt-68",
    "categoryId": "category-8",
    "categoryName": "Demon_Slayer"
  },
  {
    "name": "Sanemi Shinazugawa",
    "imageUrl": "./images/Sanemi Shinazugawa.jpeg",
    "category": "Demon_Slayer",
    "id": "prompt-69",
    "categoryId": "category-8",
    "categoryName": "Demon_Slayer"
  },
  {
    "name": "Gyomei Himejima",
    "imageUrl": "./images/Gyomei Himejima.png",
    "category": "Demon_Slayer",
    "id": "prompt-70",
    "categoryId": "category-8",
    "categoryName": "Demon_Slayer"
  },
  {
    "name": "Shinobu Kocho",
    "imageUrl": "./images/Shinobu Kocho.png",
    "category": "Demon_Slayer",
    "id": "prompt-71",
    "categoryId": "category-8",
    "categoryName": "Demon_Slayer"
  },
  {
    "name": "Kanae Kocho",
    "imageUrl": "./images/Kanae Kocho.jpg",
    "category": "Demon_Slayer",
    "id": "prompt-72",
    "categoryId": "category-8",
    "categoryName": "Demon_Slayer"
  },
  {
    "name": "Pikachu",
    "imageUrl": "./images/Pikachu.jpg",
    "category": "Pokémon",
    "id": "prompt-73",
    "categoryId": "category-9",
    "categoryName": "Pokémon"
  },
  {
    "name": "Ash Ketchum",
    "imageUrl": "./images/Ash Ketchum.jpg",
    "category": "Pokémon",
    "id": "prompt-74",
    "categoryId": "category-9",
    "categoryName": "Pokémon"
  },
  {
    "name": "Misty",
    "imageUrl": "./images/Misty.png",
    "category": "Pokémon",
    "id": "prompt-75",
    "categoryId": "category-9",
    "categoryName": "Pokémon"
  },
  {
    "name": "Brock",
    "imageUrl": "./images/Brock.png",
    "category": "Pokémon",
    "id": "prompt-76",
    "categoryId": "category-9",
    "categoryName": "Pokémon"
  },
  {
    "name": "Charizard",
    "imageUrl": "./images/Charizard.png",
    "category": "Pokémon",
    "id": "prompt-77",
    "categoryId": "category-9",
    "categoryName": "Pokémon"
  },
  {
    "name": "Bulbasaur",
    "imageUrl": "./images/Bulbasaur.png",
    "category": "Pokémon",
    "id": "prompt-78",
    "categoryId": "category-9",
    "categoryName": "Pokémon"
  },
  {
    "name": "jigglypuff",
    "imageUrl": "./images/jigglypuff.jpg",
    "category": "Pokémon",
    "id": "prompt-79",
    "categoryId": "category-9",
    "categoryName": "Pokémon"
  },
  {
    "name": "Squirtle",
    "imageUrl": "./images/Squirtle.png",
    "category": "Pokémon",
    "id": "prompt-80",
    "categoryId": "category-9",
    "categoryName": "Pokémon"
  },
  {
    "name": "Meowth",
    "imageUrl": "./images/Meowth.png",
    "category": "Pokémon",
    "id": "prompt-81",
    "categoryId": "category-9",
    "categoryName": "Pokémon"
  },
  {
    "name": "Scooby-Doo",
    "imageUrl": "./images/Scooby-Doo.png",
    "category": "Scooby-Doo",
    "id": "prompt-82",
    "categoryId": "category-10",
    "categoryName": "Scooby-Doo"
  },
  {
    "name": "Shaggy",
    "imageUrl": "./images/Shaggy.png",
    "category": "Scooby-Doo",
    "id": "prompt-83",
    "categoryId": "category-10",
    "categoryName": "Scooby-Doo"
  },
  {
    "name": "Velma",
    "imageUrl": "./images/Velma.png",
    "category": "Scooby-Doo",
    "id": "prompt-84",
    "categoryId": "category-10",
    "categoryName": "Scooby-Doo"
  },
  {
    "name": "Daphne",
    "imageUrl": "./images/Daphne.png",
    "category": "Scooby-Doo",
    "id": "prompt-85",
    "categoryId": "category-10",
    "categoryName": "Scooby-Doo"
  },
  {
    "name": "Fred",
    "imageUrl": "./images/Fred.png",
    "category": "Scooby-Doo",
    "id": "prompt-86",
    "categoryId": "category-10",
    "categoryName": "Scooby-Doo"
  },
  {
    "name": "Blossom",
    "imageUrl": "./images/Blossom.jpg",
    "category": "Powerpuff_Girls",
    "id": "prompt-87",
    "categoryId": "category-11",
    "categoryName": "Powerpuff_Girls"
  },
  {
    "name": "Bubbles",
    "imageUrl": "./images/Bubbles.jpg",
    "category": "Powerpuff_Girls",
    "id": "prompt-88",
    "categoryId": "category-11",
    "categoryName": "Powerpuff_Girls"
  },
  {
    "name": "Buttercup",
    "imageUrl": "./images/Buttercup.png",
    "category": "Powerpuff_Girls",
    "id": "prompt-89",
    "categoryId": "category-11",
    "categoryName": "Powerpuff_Girls"
  },
  {
    "name": "Professor Utonium",
    "imageUrl": "./images/Professor Utonium.png",
    "category": "Powerpuff_Girls",
    "id": "prompt-90",
    "categoryId": "category-11",
    "categoryName": "Powerpuff_Girls"
  },
  {
    "name": "Ben Tennyson",
    "imageUrl": "./images/Ben 10.png",
    "category": "Ben_10",
    "id": "prompt-91",
    "categoryId": "category-12",
    "categoryName": "Ben_10"
  },
  {
    "name": "Grandpa Max",
    "imageUrl": "./images/Grandpa Max.png",
    "category": "Ben_10",
    "id": "prompt-92",
    "categoryId": "category-12",
    "categoryName": "Ben_10"
  },
  {
    "name": "Gwen Tennyson",
    "imageUrl": "./images/gwen.png",
    "category": "Ben_10",
    "id": "prompt-93",
    "categoryId": "category-12",
    "categoryName": "Ben_10"
  },
  {
    "name": "Kevin Levin",
    "imageUrl": "./images/Kevin.jpg",
    "category": "Ben_10",
    "id": "prompt-94",
    "categoryId": "category-12",
    "categoryName": "Ben_10"
  },
  {
    "name": "Naruto Uzumaki",
    "imageUrl": "./images/Naruto.png",
    "category": "Naruto",
    "id": "prompt-95",
    "categoryId": "category-13",
    "categoryName": "Naruto"
  },
  {
    "name": "Sasuke Uchiha",
    "imageUrl": "./images/Sasuke.png",
    "category": "Naruto",
    "id": "prompt-96",
    "categoryId": "category-13",
    "categoryName": "Naruto"
  },
  {
    "name": "Sakura Haruno",
    "imageUrl": "./images/Sakura.png",
    "category": "Naruto",
    "id": "prompt-97",
    "categoryId": "category-13",
    "categoryName": "Naruto"
  },
  {
    "name": "Kakashi",
    "imageUrl": "./images/Kakashi.png",
    "category": "Naruto",
    "id": "prompt-98",
    "categoryId": "category-13",
    "categoryName": "Naruto"
  },
  {
    "name": "Madara Uchiha",
    "imageUrl": "./images/madara uchiha.png",
    "category": "Naruto",
    "id": "prompt-99",
    "categoryId": "category-13",
    "categoryName": "Naruto"
  },
  {
    "name": "Goku",
    "imageUrl": "./images/Goku.png",
    "category": "Dragon_Ball_Z",
    "id": "prompt-100",
    "categoryId": "category-14",
    "categoryName": "Dragon_Ball_Z"
  },
  {
    "name": "Vegeta",
    "imageUrl": "./images/Vegeta.webp",
    "category": "Dragon_Ball_Z",
    "id": "prompt-101",
    "categoryId": "category-14",
    "categoryName": "Dragon_Ball_Z"
  },
  {
    "name": "Gohan",
    "imageUrl": "./images/Gohan.png",
    "category": "Dragon_Ball_Z",
    "id": "prompt-102",
    "categoryId": "category-14",
    "categoryName": "Dragon_Ball_Z"
  },
  {
    "name": "Piccolo",
    "imageUrl": "./images/Piccolo.png",
    "category": "Dragon_Ball_Z",
    "id": "prompt-103",
    "categoryId": "category-14",
    "categoryName": "Dragon_Ball_Z"
  },
  {
    "name": "Monkey D. Luffy",
    "imageUrl": "./images/Luffy.png",
    "category": "One_Piece",
    "id": "prompt-104",
    "categoryId": "category-15",
    "categoryName": "One_Piece"
  },
  {
    "name": "Roronoa Zoro",
    "imageUrl": "./images/Zoro.png",
    "category": "One_Piece",
    "id": "prompt-105",
    "categoryId": "category-15",
    "categoryName": "One_Piece"
  },
  {
    "name": "Nami",
    "imageUrl": "./images/Nami.png",
    "category": "One_Piece",
    "id": "prompt-106",
    "categoryId": "category-15",
    "categoryName": "One_Piece"
  },
  {
    "name": "Eren Yeager",
    "imageUrl": "./images/Eren Yeager.jpg",
    "category": "Attack_on_Titan",
    "id": "prompt-107",
    "categoryId": "category-16",
    "categoryName": "Attack_on_Titan"
  },
  {
    "name": "Mikasa Ackerman",
    "imageUrl": "./images/Mikasa Ackerman.png",
    "category": "Attack_on_Titan",
    "id": "prompt-108",
    "categoryId": "category-16",
    "categoryName": "Attack_on_Titan"
  },
  {
    "name": "Armin Arlert",
    "imageUrl": "./images/Armin Arlert.png",
    "category": "Attack_on_Titan",
    "id": "prompt-109",
    "categoryId": "category-16",
    "categoryName": "Attack_on_Titan"
  },
  {
    "name": "Light Yagami",
    "imageUrl": "./images/Light Yagami.png",
    "category": "Death_Note",
    "id": "prompt-110",
    "categoryId": "category-17",
    "categoryName": "Death_Note"
  },
  {
    "name": "L",
    "imageUrl": "./images/L.png",
    "category": "Death_Note",
    "id": "prompt-111",
    "categoryId": "category-17",
    "categoryName": "Death_Note"
  },
  {
    "name": "Ryuk",
    "imageUrl": "./images/Ryuk.jpeg",
    "category": "Death_Note",
    "id": "prompt-112",
    "categoryId": "category-17",
    "categoryName": "Death_Note"
  },
  {
    "name": "Satoru Gojo",
    "imageUrl": "./images/satoru gojo.png",
    "category": "Jujutsu_Kaisen",
    "id": "prompt-113",
    "categoryId": "category-18",
    "categoryName": "Jujutsu_Kaisen"
  },
  {
    "name": "Suguru Geto",
    "imageUrl": "./images/Suguru Geto.png",
    "category": "Jujutsu_Kaisen",
    "id": "prompt-114",
    "categoryId": "category-18",
    "categoryName": "Jujutsu_Kaisen"
  },
  {
    "name": "Ryomen Sukuna",
    "imageUrl": "./images/Ryomen Sukuna.jpg",
    "category": "Jujutsu_Kaisen",
    "id": "prompt-115",
    "categoryId": "category-18",
    "categoryName": "Jujutsu_Kaisen"
  },
  {
    "name": "Yuji Itadori",
    "imageUrl": "./images/Yuji Itadori.png",
    "category": "Jujutsu_Kaisen",
    "id": "prompt-116",
    "categoryId": "category-18",
    "categoryName": "Jujutsu_Kaisen"
  },
  {
    "name": "Megumi Fushiguro",
    "imageUrl": "./images/Megumi Fushiguro.png",
    "category": "Jujutsu_Kaisen",
    "id": "prompt-117",
    "categoryId": "category-18",
    "categoryName": "Jujutsu_Kaisen"
  },
  {
    "name": "Nobara Kugisaki",
    "imageUrl": "./images/Nobara Kugisaki.png",
    "category": "Jujutsu_Kaisen",
    "id": "prompt-118",
    "categoryId": "category-18",
    "categoryName": "Jujutsu_Kaisen"
  },
  {
    "name": "Kento Nanami",
    "imageUrl": "./images/Kento Nanami.png",
    "category": "Jujutsu_Kaisen",
    "id": "prompt-119",
    "categoryId": "category-18",
    "categoryName": "Jujutsu_Kaisen"
  },
  {
    "name": "Masamichi Yaga",
    "imageUrl": "./images/Masamichi Yaga.png",
    "category": "Jujutsu_Kaisen",
    "id": "prompt-120",
    "categoryId": "category-18",
    "categoryName": "Jujutsu_Kaisen"
  },
  {
    "name": "Yuta Okkotsu",
    "imageUrl": "./images/Yuta Okkotsu.png",
    "category": "Jujutsu_Kaisen",
    "id": "prompt-121",
    "categoryId": "category-18",
    "categoryName": "Jujutsu_Kaisen"
  },
  {
    "name": "Maki Zenin",
    "imageUrl": "./images/Maki Zenin.png",
    "category": "Jujutsu_Kaisen",
    "id": "prompt-122",
    "categoryId": "category-18",
    "categoryName": "Jujutsu_Kaisen"
  },
  {
    "name": "Aoi Todo",
    "imageUrl": "./images/Aoi Todo.png",
    "category": "Jujutsu_Kaisen",
    "id": "prompt-123",
    "categoryId": "category-18",
    "categoryName": "Jujutsu_Kaisen"
  },
  {
    "name": "Master Tengen",
    "imageUrl": "./images/Master Tengen.png",
    "category": "Jujutsu_Kaisen",
    "id": "prompt-124",
    "categoryId": "category-18",
    "categoryName": "Jujutsu_Kaisen"
  },
  {
    "name": "Choso",
    "imageUrl": "./images/Choso.png",
    "category": "Jujutsu_Kaisen",
    "id": "prompt-125",
    "categoryId": "category-18",
    "categoryName": "Jujutsu_Kaisen"
  },
  {
    "name": "Toji Fushiguro",
    "imageUrl": "./images/Toji Fushiguro.png",
    "category": "Jujutsu_Kaisen",
    "id": "prompt-126",
    "categoryId": "category-18",
    "categoryName": "Jujutsu_Kaisen"
  },
  {
    "name": "Mahito",
    "imageUrl": "./images/Mahito.png",
    "category": "Jujutsu_Kaisen",
    "id": "prompt-127",
    "categoryId": "category-18",
    "categoryName": "Jujutsu_Kaisen"
  },
  {
    "name": "Jogo",
    "imageUrl": "./images/Jogo.jpeg",
    "category": "Jujutsu_Kaisen",
    "id": "prompt-128",
    "categoryId": "category-18",
    "categoryName": "Jujutsu_Kaisen"
  },
  {
    "name": "Hanami",
    "imageUrl": "./images/Hanami.png",
    "category": "Jujutsu_Kaisen",
    "id": "prompt-129",
    "categoryId": "category-18",
    "categoryName": "Jujutsu_Kaisen"
  }
];
