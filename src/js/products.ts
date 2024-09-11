

const products : Product[] = [
      {
        id : 1,
        name: "4\" Gold Lakshmi",
        printName: "4\" Gold Lakshmi",
        unit: "1 Pkt 5 Pcs.",
        price: Amount.from(160),
        category: "CRACKERS:ONE SOUND",
        tag: new Set(["CRACKERS", "ONE SOUND"]),
      },
      {
        id : 2,
        name: "Bullet Bomb",
        printName: "Bullet Bomb",
        unit: "1 Pkt 10 Pcs.",
        price: Amount.from(120),
        category: "CRACKERS:BOMB",
        tag: new Set(["CRACKERS", "BOMB"]),
      },
      {
        id: 3,
        name: "Red Bijili",
        printName: "Red Bijili",
        unit: "1 Pkt 50 Pcs.",
        price: Amount.from(65),
        category: "CRACKERS:BIJILI",
        tag: new Set(["CRACKERS", "BIJILI"]),
      }, 
      {
        id: 4,
        name: "Flower Pots Small",
        printName: "Flower Pots Small",
        unit: "1 Box 10 Pcs",
        price: Amount.from(210),
        category: "FLOWER POTS",
        tag: new Set(["FLOWER POT"]),
      }
]