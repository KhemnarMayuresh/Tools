        // Categories data
        const defaultSelectedCategories = ['Marvel', 'DC', 'Doraemon', 'Shinchan', 'Chhota_Bheem'];

        const data = [
            // Marvel Category
            { name: "Iron Man", imageUrl: "./images/Iron_Man.jpg", category: "Marvel" },
            { name: "Captain America", imageUrl: "./images/Captain_America.jpg", category: "Marvel" },
            { name: "SpiderMan", imageUrl: "./images/SpiderMan.png", category: "Marvel" },
            { name: "Deadpool", imageUrl: "./images/Deadpool.png", category: "Marvel" },
            { name: "Thor", imageUrl: "./images/Thor.png", category: "Marvel" },
            { name: "Hulk", imageUrl: "./images/Hulk.jpg", category: "Marvel" },
            { name: "Black Widow", imageUrl: "./images/Black Widow.png", category: "Marvel" },
            { name: "Ant Man", imageUrl: "./images/Ant Man.png", category: "Marvel" },
            { name: "Dr. Strange", imageUrl: "./images/Doctor-Strange.png", category: "Marvel" },
            { name: "Hawkeye", imageUrl: "./images/Hawkeye.png", category: "Marvel" },
            { name: "Black Panther", imageUrl: "./images/Black Panther.jpg", category: "Marvel" },
            { name: "Wanda Maximoff", imageUrl: "./images/Wanda Maximoff.png", category: "Marvel" },
            { name: "Loki", imageUrl: "./images/Loki.png", category: "Marvel" },
            { name: "Thanos", imageUrl: "./images/Thanos.png", category: "Marvel" },
            { name: "Wolverine", imageUrl: "./images/Wolverine.png", category: "Marvel" },

            // DC Category
            { name: "Batman", imageUrl: "./images/Batman.png", category: "DC" },
            { name: "Superman", imageUrl: "./images/Superman.png", category: "DC" },
            { name: "Wonder Woman", imageUrl: "./images/Wonder Women.png", category: "DC" },
            { name: "Flash", imageUrl: "./images/Flash.jpg", category: "DC" },
            { name: "Aquaman", imageUrl: "./images/Aquaman.png", category: "DC" },
            { name: "Joker", imageUrl: "./images/Joker.png", category: "DC" },
            // Add more

            // Doraemon  Category
            { name: "Doraemon ", imageUrl: "./images/Doraemon.png", category: "Doraemon" },
            { name: "Nobita", imageUrl: "./images/Nobita.png", category: "Doraemon" },
            { name: "Shizuka", imageUrl: "./images/Shizuka.png", category: "Doraemon" },
            { name: "Suneo", imageUrl: "./images/Suneo.jpg", category: "Doraemon" },
            { name: "Gian", imageUrl: "./images/Gian.png", category: "Doraemon" },
            { name: "Dorami", imageUrl: "./images/Dorami.png", category: "Doraemon" },
            { name: "Dekisugi", imageUrl: "./images/Dekisugi.jpg", category: "Doraemon" },

            // Shinchan Category
            { name: "Shinchan", imageUrl: "./images/Shinchan.png", category: "Shinchan" },
            { name: "Hiroshi", imageUrl: "./images/Hiroshi.png", category: "Shinchan" },
            { name: "Misae", imageUrl: "./images/Misae.png", category: "Shinchan" },
            { name: "himawari", imageUrl: "./images/himawari.png", category: "Shinchan" },
            { name: "Shiro", imageUrl: "./images/Shiro.png", category: "Shinchan" },
            { name: "Ai Chan", imageUrl: "./images/Ai Chan.jpg", category: "Shinchan" },
            { name: "Kazama", imageUrl: "./images/kazama.png", category: "Shinchan" },
            { name: "Boo", imageUrl: "./images/boo.jpg", category: "Shinchan" },
            { name: "Nene", imageUrl: "./images/Nene.jpg", category: "Shinchan" },
            { name: "Masao", imageUrl: "./images/masao.png", category: "Shinchan" },
            { name: "Action Kamen", imageUrl: "./images/Action Kamen.png", category: "Shinchan" },

            // Mickey Mouse Category
            { name: "Mickey Mouse", imageUrl: "./images/Mickey Mouse.png", category: "Mickey_Mouse" },
            { name: "Goofy", imageUrl: "./images/Goofy.png", category: "Mickey_Mouse" },
            { name: "Pluto", imageUrl: "./images/Pluto.jpg", category: "Mickey_Mouse" },

            // Chhota Bheem Category
            { name: "Chhota Bheem", imageUrl: "./images/Chhota Bheem.png", category: "Chhota_Bheem" },
            { name: "Chutki", imageUrl: "./images/Chutki.jpg", category: "Chhota_Bheem" },
            { name: "Rajkumar Indumati", imageUrl: "./images/Rajkumar Indumati.jpg", category: "Chhota_Bheem" },
            { name: "Raju", imageUrl: "./images/Raju.png", category: "Chhota_Bheem" },
            { name: "Jaggu", imageUrl: "./images/Jaggu.png", category: "Chhota_Bheem" },
            { name: "Kalia", imageUrl: "./images/Kalia.jpg", category: "Chhota_Bheem" },
            { name: "Dholu-Bholu", imageUrl: "./images/Dholu-Bholu.jpg", category: "Chhota_Bheem" },

            // Indian Category
            { name: "Shaktimaan", imageUrl: "./images/Shaktimaan.jpeg", category: "Indian_Characters" },
            { name: "Hero", imageUrl: "./images/Hero.png", category: "Indian_Characters" },
            { name: "Krrish", imageUrl: "./images/Krrish.jpg", category: "Indian_Characters" },
            { name: "Modi", imageUrl: "./images/Modi.jpg", category: "Indian_Characters" },
            { name: "Dhoni", imageUrl: "./images/Dhoni.jpg", category: "Indian_Characters" },
            { name: "Salman", imageUrl: "./images/Salman.png", category: "Indian_Characters" },
            { name: "Shahrukh", imageUrl: "./images/Shah-rukh-khan.png", category: "Indian_Characters" },
            // Add more

            // Demon Slayer Characters
            { name: "Tanjiro Kamado", imageUrl: "./images/Tanjiro_Kamado.png", category: "Demon_Slayer" },
            { name: "Nezuko Kamado", imageUrl: "./images/nezuko.jpg", category: "Demon_Slayer" },
            { name: "Zenitsu Agatsuma", imageUrl: "./images/Zenitsu.png", category: "Demon_Slayer" },
            { name: "Inosuke Hashibira", imageUrl: "./images/Inosuke.png", category: "Demon_Slayer" },
            { name: "Muzan", imageUrl: "./images/Muzan.png", category: "Demon_Slayer" },
            // { name: "Muzan 2", imageUrl: "./images/muzan.jpg", category: "Demon_Slayer" }, 
            { name: "Akaza", imageUrl: "./images/Akaza.png", category: "Demon_Slayer" },
            { name: "Rengoku", imageUrl: "./images/Rengoku.png", category: "Demon_Slayer" },
            { name: "Muichiro Tokito", imageUrl: "./images/Muichiro_Tokito.png", category: "Demon_Slayer" },
            { name: "Tengen Uzui", imageUrl: "./images/Tengen Uzui.jpg", category: "Demon_Slayer" },
            { name: "Obanai Iguro", imageUrl: "./images/Obanai Iguro.jpg", category: "Demon_Slayer" },
            { name: "Mitsuri Kanroji", imageUrl: "./images/Mitsuri Kanroji.png", category: "Demon_Slayer" },
            { name: "Giyu Tomioka", imageUrl: "./images/Giyu Tomioka.png", category: "Demon_Slayer" },
            { name: "Sanemi Shinazugawa", imageUrl: "./images/Sanemi Shinazugawa.jpeg", category: "Demon_Slayer" },
            { name: "Gyomei Himejima", imageUrl: "./images/Gyomei Himejima.png", category: "Demon_Slayer" },
            { name: "Shinobu Kocho", imageUrl: "./images/Shinobu Kocho.png", category: "Demon_Slayer" },
            { name: "Kanae Kocho", imageUrl: "./images/Kanae Kocho.jpg", category: "Demon_Slayer" },

            // Pokémon Characters
            { name: "Pikachu", imageUrl: "./images/Pikachu.jpg", category: "Pokémon" },
            { name: "Ash Ketchum", imageUrl: "./images/Ash Ketchum.jpg", category: "Pokémon" },
            { name: "Misty", imageUrl: "./images/Misty.png", category: "Pokémon" },
            { name: "Brock", imageUrl: "./images/Brock.png", category: "Pokémon" },
            { name: "Charizard", imageUrl: "./images/Charizard.png", category: "Pokémon" },
            { name: "Bulbasaur", imageUrl: "./images/Bulbasaur.png", category: "Pokémon" },
            { name: "jigglypuff", imageUrl: "./images/jigglypuff.jpg", category: "Pokémon" },
            { name: "Squirtle", imageUrl: "./images/Squirtle.png", category: "Pokémon" },
            { name: "Meowth", imageUrl: "./images/Meowth.png", category: "Pokémon" },
            { name: "Charizard", imageUrl: "./images/Charizard.png", category: "Pokémon" },
            // Add more

            // Scooby-Doo Characters
            { name: "Scooby-Doo", imageUrl: "./images/Scooby-Doo.png", category: "Scooby-Doo" },
            { name: "Shaggy", imageUrl: "./images/shaggy.png", category: "Scooby-Doo" },
            { name: "Velma", imageUrl: "./images/velma.png", category: "Scooby-Doo" },
            { name: "Daphne", imageUrl: "./images/daphne.png", category: "Scooby-Doo" },
            { name: "Fred", imageUrl: "./images/fred.png", category: "Scooby-Doo" },

            // Powerpuff Girls Characters
            { name: "Blossom", imageUrl: "./images/Blossom.jpg", category: "Powerpuff_Girls" },
            { name: "Bubbles", imageUrl: "./images/bubbles.jpg", category: "Powerpuff_Girls" },
            { name: "Buttercup", imageUrl: "./images/buttercup.png", category: "Powerpuff_Girls" },
            { name: "Professor Utonium", imageUrl: "./images/Professor Utonium.png", category: "Powerpuff_Girls" },

            // Ben 10 Characters
            { name: "Ben Tennyson", imageUrl: "./images/Ben 10.png", category: "Ben_10" },
            { name: "Grandpa Max", imageUrl: "./images/Grandpa Max.png", category: "Ben_10" },
            { name: "Gwen Tennyson", imageUrl: "./images/gwen.png", category: "Ben_10" },
            { name: "Kevin Levin", imageUrl: "./images/Kevin.jpg", category: "Ben_10" },
            // Add more

            // Naruto Characters
            { name: "Naruto Uzumaki", imageUrl: "./images/Naruto.png", category: "Naruto" },
            { name: "Sasuke Uchiha", imageUrl: "./images/Sasuke.png", category: "Naruto" },
            { name: "Sakura Haruno", imageUrl: "./images/Sakura.png", category: "Naruto" },
            { name: "Kakashi", imageUrl: "./images/Kakashi.png", category: "Naruto" },
            { name: "Madara Uchiha", imageUrl: "./images/madara uchiha.png", category: "Naruto" },
            // Add more

            // Dragon_Ball_Z Characters
            { name: "Goku", imageUrl: "./images/Goku.png", category: "Dragon_Ball_Z" },
            { name: "Vegeta", imageUrl: "./images/Vegeta.webp", category: "Dragon_Ball_Z" },
            { name: "Gohan", imageUrl: "./images/Gohan.png", category: "Dragon_Ball_Z" },
            { name: "Piccolo", imageUrl: "./images/Piccolo.png", category: "Dragon_Ball_Z" },
            // Add more

            // One Piece Characters
            { name: "Monkey D. Luffy", imageUrl: "./images/Luffy.png", category: "One_Piece" },
            { name: "Roronoa Zoro", imageUrl: "./images/Zoro.png", category: "One_Piece" },
            { name: "Nami", imageUrl: "./images/Nami.png", category: "One_Piece" },
            // Add more

            // Attack on Titan Characters
            { name: "Eren Yeager", imageUrl: "./images/Eren Yeager.jpg", category: "Attack_on_Titan" },
            { name: "Mikasa Ackerman", imageUrl: "./images/Mikasa Ackerman.png", category: "Attack_on_Titan" },
            { name: "Armin Arlert", imageUrl: "./images/Armin Arlert.png", category: "Attack_on_Titan" },

            // Death Note Characters
            { name: "Light Yagami", imageUrl: "./images/Light Yagami.png", category: "Death_Note" },
            { name: "L", imageUrl: "./images/L.png", category: "Death_Note" },
            { name: "Ryuk", imageUrl: "./images/Ryuk.jpeg", category: "Death_Note" },

            // jujutsu kaisen Characters
            { name: "Satoru Gojo", imageUrl: "./images/satoru gojo.png", category: "Jujutsu_Kaisen" },
            { name: "Suguru Geto", imageUrl: "./images/Suguru Geto.png", category: "Jujutsu_Kaisen" },
            { name: "Ryomen Sukuna", imageUrl: "./images/Ryomen Sukuna.jpg", category: "Jujutsu_Kaisen" },
            { name: "Yuji Itadori", imageUrl: "./images/Yuji Itadori.png", category: "Jujutsu_Kaisen" },
            { name: "Megumi Fushiguro", imageUrl: "./images/Megumi Fushiguro.png", category: "Jujutsu_Kaisen" },
            { name: "Nobara Kugisaki", imageUrl: "./images/Nobara Kugisaki.png", category: "Jujutsu_Kaisen" },
            { name: "Kento Nanami", imageUrl: "./images/Kento Nanami.png", category: "Jujutsu_Kaisen" },
            { name: "Masamichi Yaga", imageUrl: "./images/Masamichi Yaga.png", category: "Jujutsu_Kaisen" },
            { name: "Yuta Okkotsu", imageUrl: "./images/Yuta Okkotsu.png", category: "Jujutsu_Kaisen" },
            { name: "Maki Zenin", imageUrl: "./images/Maki Zenin.png", category: "Jujutsu_Kaisen" },
            { name: "Aoi Todo", imageUrl: "./images/Aoi Todo.png", category: "Jujutsu_Kaisen" },
            { name: "Master Tengen", imageUrl: "./images/Master Tengen.png", category: "Jujutsu_Kaisen" },
            { name: "Choso", imageUrl: "./images/Choso.png", category: "Jujutsu_Kaisen" },
            { name: "Toji Fushiguro", imageUrl: "./images/Toji Fushiguro.png", category: "Jujutsu_Kaisen" },
            { name: "Mahito", imageUrl: "./images/Mahito.png", category: "Jujutsu_Kaisen" },
            { name: "Jogo", imageUrl: "./images/Jogo.jpeg", category: "Jujutsu_Kaisen" },
            { name: "Hanami", imageUrl: "./images/Hanami.png", category: "Jujutsu_Kaisen" },
            // Add more
        ];
