import { setAudioPath } from "kontra";
import dollar from './images/dollar-outline.png';
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
  new Item('neck', 'Neck Brace', 'Adds 1 extra life per round!', 200, false),
  new Item('steel', 'Steel Tipped Beak', 'Adds 2 extra lives per round!', 500, false),
  new Item('ordinance', 'Influence City Ordinances', 'Mandate high-viz coating! 50% chance to avoid windows.', 1500, false),
  new Item('sabotage', 'Sabotage Glass Supply', 'Easy-break glass! 50% chance to avoid death.', 2000, false),
  new Item('agile', 'Agility Training', 'Better, stronger, faster! More responsive bird.', 4000, false),
]

export function setAvailable() {
  const available = document.getElementById('available');

  if (available) {
    const money = getStats().money;

    available.innerHTML = `You have ${money} <img src="${dollar}" /> available!`
  }
}

export function setupStore() {
  console.log('SETUP STORE! Do not call this more than once...');
  const wrapper = document.getElementById('items');
  const buy = document.getElementById('buy');
  const img = document.createElement('img');
  img.src = dollar;

  setStats({money: 10000})

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
      }
    })

    const stats = getStats();

    items.forEach(item => {
      const owned = stats.purchases[item.id];
      const btn = document.createElement('button');

      btn.classList.add('item');
      btn.innerHTML = item.title;
      if (owned) {
        btn.classList.add('owned');
      }

      btn.addEventListener('click', () => {
        buy.setAttribute('data-id', item.id);

        if (owned) {
          buy.innerHTML = `${item.desc} You already own this!`
        } else {
          buy.innerHTML = `${item.desc} Click to buy for ${item.cost}`
          buy.appendChild(img);
        }
        btn.id = item.id;
        btn.style.border = '1px #fff solid';
      })
      wrapper.appendChild(btn);
    })
  }
}

function purchase() {

}
