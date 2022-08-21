import { dollarImg } from './sprites';
import dollarRawImage from './images/dollar-outline.png';
import { getStats, setStats } from './data'

interface Item {
  id: string;
  title: string;
  desc: string;
  cost: number;
  purchased: boolean;
}

class Item {
  constructor(id: string, title: string, desc: string, cost: number, purchased: boolean) {
    this.id = id;
    this.title = title;
    this.desc = desc;
    this.cost = cost;
    this.purchased = purchased;
  }
}

export const items = [
  new Item('neck', 'Neck Brace', 'Adds 1 extra life per round!', 100, false),
  new Item('steel', 'Steel Tipped Beak', 'Adds 2 extra lives per round!', 200, false),
  new Item('money', 'Money Magnet', 'Much larger pickup radius!', 500, false),
  new Item('agile', 'Agility Training', 'Better, stronger, faster! More responsive bird.', 800, false),
  new Item('sabotage', 'Sabotage Glass Supply', 'Easy-break glass! 50% chance to avoid death.', 1500, false),
]

export function setAvailable() {
  console.log('dollarImg', dollarImg)

  const available = document.getElementById('available');

  if (available) {
    const money = getStats().money;

    available.innerHTML = `You have ${money} <span id="available-img"></span> available!`
    document.getElementById('available-img')?.appendChild(dollarImg.cloneNode());
  }
}

export function setupStore() {
  console.log('SETUP STORE! Do not call this more than once...');
  const wrapper = document.getElementById('items');
  const buy = document.getElementById('buy');
  const img = document.createElement('img');

  // setStats({money: 10000})

  if (wrapper && buy) {
    buy.addEventListener('click', (e) => {
      const stats = getStats();
      const id = (e.target as HTMLElement).getAttribute('data-id') || '';
      const item = items.filter(item => item.id === id)[0];
      const clickedBtn = document.getElementById(id);

      if (stats.money >= item.cost && !stats.purchases[id]) {
        setStats({
          money: stats.money - item.cost,
          purchases: { [item.id]: item.id },
        })

        if (clickedBtn) {
          clickedBtn.classList.add('owned');
          const newBtn = clickedBtn.cloneNode(true)
          clickedBtn.parentNode?.replaceChild(newBtn, clickedBtn);
          buy.innerHTML = `${item.desc} You already own this!`
          buy.setAttribute('data-id', item.id);

          newBtn.addEventListener('click', () => {
            buy.innerHTML = `${item.desc} You already own this!`
            buy.setAttribute('data-id', item.id);
          })
        }

        setAvailable();
      } else {
        const availableBtn = document.getElementById('available')!;
        availableBtn.style.animationName = 'emphasize';
        setTimeout(() => {
          availableBtn.style.animationName = '';
        }, 400)
      }
    })

    const stats = getStats();

    items.forEach(item => {
      const owned = stats.purchases[item.id];
      const btn = document.createElement('button');
      const amt = document.createElement('div');
      
      btn.classList.add('item');
      btn.innerHTML = item.title;
      amt.innerHTML = item.cost.toString();
      amt.classList.add('itemAmount');
      const amtImg = document.createElement('img');
      amtImg.src = dollarRawImage;
      amt.append(amtImg);

      btn.appendChild(amt);
      if (owned) {
        btn.classList.add('owned');
      }

      btn.addEventListener('click', () => {
        buy.setAttribute('data-id', item.id);
        dollarImg.setAttribute('data-id', item.id);

        if (owned) {
          buy.innerHTML = `${item.desc} You already own this!`
        } else {
          buy.innerHTML = `${item.desc} Click here to buy for ${item.cost}`
          buy.appendChild(dollarImg);
        }
        btn.id = item.id;
        btn.style.border = '1px #fff solid';
      })
      wrapper.appendChild(btn);
    })
  }
}
