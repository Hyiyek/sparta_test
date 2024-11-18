import chalk from "chalk";
import readlineSync from "readline-sync";

class Player {
  constructor() {
    this.hp = 100; // 플레이어 체력
    this.centerHeal = 40; // 플레이어 힐량
    this.playerPower = 10; // 플레이어 공격력 / 주는데미지
    
  }
  // monster.hp >> 몬스터정보와 hp
  attackPower(stage) {
    // 0 ~ 0.999999 
    // Math.random() * (stage * 5)
    // 1 * (stage * 5) = 1 * (5 * 5) = 1 * 25 = 25
    //최소0  최대 10 => 0 ~ 25까지 랜덤
    const result = Math.floor(Math.random() * (stage * 5));

    // 10 ~ 35 사이
    this.playerPower += result;
  }
  strongAttackPower(monster) {
    const damage = this.playerPower * 4;
    monster.hp = Math.max(monster.hp - damage, 0);
    
  }

  reflection(monster) {
    monster.hp -= monster.monsterDamage;
  }

  heal() {
    const playerheal = this.centerHeal;
    this.hp = Math.max(this.hp + playerheal,100);
  }

  attack(monster) {
    const damage = this.playerPower;
    monster.hp = Math.max(monster.hp - damage, 0);
    
  }
  
  
}
  
class Monster {
  constructor(stage) {
    this.hp = 100;
    this.stagePerPower = 5; // 몬스터 공격력
    this.monsterDamage = 10; // 몬스터가 플레이어하태 주는데미지
    this.randomLevel(stage);// 스테이지 증가시 몬스터공격력증가 함수를 스테이지로받아오기
  }


  attacker(player) {
    const damagemonster = this.monsterDamage;
    player.hp = Math.max(player.hp - damagemonster, 0);
  }
  randomLevel(stage) {
    const value = Math.floor(Math.random() * (stage * 5));
    this.stagePerPower += value; // 스테이지 증가시 몬스터공격력 증가
  }
}




function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(`|\n Stage: ${stage} `) +
      chalk.blueBright(`|\n 플레이어 정보: HP ${player.hp}`) +
      chalk.redBright(`|\n 몬스터 정보 HP${monster.hp}`) +
      chalk.redBright(`|\n 몬스터 공격력 AD| ${monster.stagePerPower}`) +
      chalk.redBright(`|\n 플레이어 공격력 AD| ${player.playerPower}`)
  );
  console.log(chalk.magentaBright(`=====================\n`));
}

const battle = async (stage, player, monster) => {
  let logs = [];

  while (player.hp > 0 && monster.hp > 0) {
    console.clear();
    displayStatus(stage, player, monster);

    // logs 는 배열이기때문에 forEach를 이용해서
    // logs에 있는 값을 console.log로 출력한다.
    logs.forEach((log) => console.log(log));

    console.log(
      chalk.green(
        `\n1. 공격한다 2. 아무것도 하지않는다.3. 도망친다 4.반격하기 5.두번치기`
      )
    );

    // "당신의 선택은?"을 출력하고
    // 사용자가 입력할때까지 대기
    const choice = readlineSync.question("당신의 선택은? ");

    if (choice === "1") {
      player.attack(monster);
      logs.push(chalk.blue.bold(`플레이어가 몬스터하태${player.playerPower}만큼 주었습니다`));
      if (monster.hp > 0) {
        // 몬스터가 살아있으면. hp가 0보다크면 살아잇는거다
        // 몬스터가 플레이어를 공격한다.
        monster.attacker(player);
        logs.push(chalk.red.bold(`몬스터가가 플레이어하태${monster.monsterDamage}만큼 주었습니다`));
      }
    } else if (choice === "2") {
      logs.push(chalk.green.bold(`아무것도하지않는다`));
    } else if (choice === "3") {
      if (Math.random() < 0.2) {
        monster.hp = 0;
        logs.push(chalk.red.bold(`도망에성공했다`));
      } else {
        logs.push(chalk.blue.bold(`도망에실패했다`));
      }
    } else if (choice === "4") {
      if (Math.random() < 0.5) {
        player.reflection(monster);
        logs.push(chalk.blue.bold(`반사에 성공 했습니다.`));
      } else {
        monster.attacker(player);
        logs.push(chalk.red.bold(`반사에 실패 했습니다.`));
      }
    } else if (choice === "5") {
      if (Math.random() < 0.5) {
        player.strongAttackPower(monster);
        logs.push(chalk.blue.bold(`두배치기에 성공 했습니다.`));
      } else {
        // 100 * 0.5 = 50;
        player.hp *= 0.5;
        logs.push(chalk.red.bold(`두배치기에 실패 했습니다.`));
      }
    }

    // 플레이어의 선택에 따라 다음 행동 처리
    logs.push(chalk.green(`${choice}를 선택하셨습니다.`));
  }

  console.clear();
  displayStatus(stage, player, monster);
  logs.forEach((log) => console.log(log));
  readlineSync.question("엔터를 누르면 계속합니다.");
};

export async function startGame() {
  console.clear();
  const player = new Player();
  let stage = 1;

  while (stage <= 10) {
    const monster = new Monster(stage);
    await battle(stage, player, monster);
    

    if (player.hp <= 0) {
      console.log(chalk.red.bold("게임오버"));
      break;
    }
    stage++;
    player.heal();
  }
  // 스테이지 클리어 처리
  console.log(chalk.red.bold("스테이지 클리어햇습니다"));
  
  player.attackPower(stage);
  
}
