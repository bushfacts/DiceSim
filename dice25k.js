var iterations = 25000;
//dice
var red = 0; //>=0
var black = 4; //>=0
var white = 6; //>=0
var defense = 3; //# sides: 1,3
var surgeO = 0; //0,1,2
var surgeD = 0; //0,1
//offensive parameters
var aim = 1; //>=0
var blast = false; //tf
var critical = 0; //>=0
var impact = 0; //>=0
var highVelocity = false; //tf
var surgeTokenO = 0; //>=0
var pierce = 0; //>=0
var precise = 0; //>=0
var ram = 0; //>=0
var sharpshooter = 0; //0,1,2
//defensive parameters
var cover = 1; //0,1,2
var armorx = 0; //>=0
var armor = false;
var dodges = 0; //>=0
var dangerSense = 0; //>=0
var deflect = false;
var djemSo = 0; //tf
var shielded = 0; //>=0
var uncannyLuck = 0; //>=0
var weakpoint = 0; //>=0
var surgeTokenD = 0; //>=0
var immunePierce = false; //tf
var immuneBlast = false; //tf
var impervious = false; //tf
var weakPoint = 0; //>=0
var outmanuever = false; //tf

var diceTrayA = [];
var diceTrayD = [];
var diceTrayU = [];
var x;
var y;
var z;
var surgeTokenOVar;
var surgeTokenDVar;
var criticalVar;
var aimPool;
var totalHits;
var totalCrits;
var totalBlocks;
var totalSurges;
var diceNumberA = red + black + white;
var wounds = [];

//red, black, then white
var hits = [0,0,0];
var crits = [0,0,0];
var surges = [0,0,0];
var blanks = [0,0,0];

//mods
if (sharpshooter>=cover) cover = 0;
else cover -= sharpshooter;
if (blast && !immuneBlast) cover = 0;
if (highVelocity) dodges = 0;
if (immunePierce && pierce>0) pierce = 0;

//beginning of loop

for (var k=0; k<iterations; k++){
  ///////////////////////////ROLL/CONVERT ATTACK DICE/////////////////////////////
  //roll
  diceTrayA = diceArray(diceNumberA,8);
  diceTrayD = [];
  //reset hits, crits, surges
  hits = [0,0,0];
  crits = [0,0,0];
  surges = [0,0,0];
  blanks = [0,0,0];
  surgeTokenOVar = surgeTokenO;
  criticalVar = critical;
  //1-x for hits. 7 is surge. 8 is crit.
  if (white>0){
    for (var i=0; i<white; i++){
      if (diceTrayA[i]<=2) hits[2]++;
      else if (diceTrayA[i]==7) surges[2]++;
      else if (diceTrayA[i]==8) crits[2]++;
    }
  }
  if (black>0){
    for (var i=white; i<white+black; i++){
      if (diceTrayA[i+white]<=4) hits[1]++;
      else if (diceTrayA[i+white]==7) surges[1]++;
      else if (diceTrayA[i+white]==8) crits[1]++;
    }
  }
  if (red>0){
    for (var i=white+black; i<white+black+red; i++){
      if (diceTrayA[i+white+black]<=6) hits[0]++;
      else if (diceTrayA[i+white+black]==7) surges[0]++;
      else if (diceTrayA[i+white+black]==8) crits[0]++;
    }
  }
  blanks[2] = white - hits[2] - crits[2] - surges[2];
  blanks[1] = black - hits[1] - crits[1] - surges[1];
  blanks[0] = red - hits[0] - crits[0] - surges[0];

  //big decisions coming up
  //critical? after aiming

  //armor? cover? dodge?
  //offensive reroll time

  //why would i ever reroll a hit?
  //judgement call on armor x
  //against armor
  //if i have surge to crit, and dice pool too small to overcome dodges/cover

  //start off with basic multi-color reroll

  //if I have no surge tokens, no critical, and no surge to hit, then start by
  //converting all surges to blanks
  if ((surgeO + surgeTokenOVar + criticalVar)==0){
    for (var i=0; i<3; i++) blanks[i] += surges[i];
    for (var i=0; i<3; i++) surges[i] = 0;
  }
  //convert surges using first surgeO, then critical, then tokens
  //can i save the surge conversion chart for last? would still have to repeatedly
  //check for surges conversion chart.... best not. not for now at least
  //maximum repititions
  else{
    if (surgeO==2){
  //easy
      for (var i=0; i<3; i++) crits[i] += surges[i];
      for (var i=0; i<3; i++) surges[i] = 0;
    }
    else{
  //for surge to hit and surge to blank
      if (criticalVar>0 && sumArr(surges)>0){
  //determine how many will be converted using a temp variable, x, so as to only
  //write the code once
        if (criticalVar>sumArr(surges)) x = sumArr(surges);
        else x = criticalVar;
  //this loop picks each die that is going to get converted
  //"for each surge token:"
        for (var i=0; i<x; i++){
  //this loop prioritizes the order of looking
  //this is where the white -> black -> red priority comes in
          for (var j=2; j>-1; j--){
            if (surges[j]>0){
              crits[j] += 1;
              surges[j] -=1;
              criticalVar -=1;
              //next i
              break;
            }
          }
        }
      }
  //now that critical is spent, check for remaining surges
      if (sumArr(surges)>0){
  //then convert using conversion chart first, otherwise spend tokens
        if (surgeO==1){
          for (var i=0; i<3; i++){
            hits[i] += surges[i];
            surges[i] = 0;
          }
        }
        else if (surgeTokenOVar>0){
          if (surgeTokenO>sumArr(surges)) x = sumArr(surges);
          else x = surgeTokenO;
          for (var i=0; i<x; i++){
            for (var j=2; j>-1; j--){
              if (surges[j]>0){
                hits[j] += 1;
                surges[j] -= 1;
                surgTokenOVar -= 1;
                break;
              }
            }
          }
        }
      }
    }
  }
  //this will have to be repeated after each aim as well for any additional surges produced
  //any remaining surges are blanks.
  surges = [0,0,0];
  //check for loss
  x = sumArr(surges) + sumArr(hits) + sumArr(crits) + sumArr(blanks);
  x -= (red + black + white);
  //console.log((x==0));

  if (aim>0){
    for (var i=0; i<aim; i++){
  //reset random dice with each aim
      aimPool = 2 + precise;
      rerolls = diceArray(aimPool, 8);
      z = 0;
  //reroll first reds, then blacks, then whites
      for (var j=0; j<3; j++){
        if (blanks[j]>0){
  //store how many we're rerolling as y
  //subtract the rerolls from the aimPool
          if (blanks[j]>aimPool){
            y = aimPool;
            aimPool = 0;
          }
          else{
            y = blanks[j];
            aimPool -= blanks[j];
          }
  //use x to store results of functions so as to not have to call the function twice
  //the counting functions need a little twist to be able to handle all three
  //dice faces....
          x = countSingle(rerolls.slice(z,y),8);
          crits[j] += x;
          blanks[j] -= x;
  //insert little twist here. Since # of hits is only difference between dice
          x = countRange(rerolls.slice(z,y),1,(5-2*j));
          hits[j] += x;
          blanks[j] -= x;
          x = countSingle(rerolls.slice(z,y),7);
          surges[j] += x;
          blanks[j] -= x;
        }
  //use z to store how many of our rerolls have been spent (as opposed to aimPool,
  //which is how many dice are left to roll). use for beginning index of slice
        z = 2 + precise - aimPool;
      }
    }
  //check for, and convert surges... every goddamn time
    if (sumArr(surges)>0){
      if ((surgeO + surgeTokenOVar + criticalVar)==0){
        for (var i=0; i<3; i++) blanks[i] += surges[i];
        for (var i=0; i<3; i++) surges[i] = 0;
      }
      else{
        if (surgeO==2){
          for (var i=0; i<3; i++) crits[i] += surges[i];
          for (var i=0; i<3; i++) surges[i] = 0;
        }
        else{
          if (criticalVar>0 && sumArr(surges)>0){
            if (criticalVar>sumArr(surges)) x = sumArr(surges);
            else x = criticalVar;
            for (var i=0; i<x; i++){
              for (var j=2; j>-1; j--){
                if (surges[j]>0){
                  crits[j] += 1;
                  surges[j] -=1;
                  criticalVar -=1;
                  //next i
                  break;
                }
              }
            }
          }
          if (sumArr(surges)>0){
            if (surgeO==1){
              for (var i=0; i<3; i++){
                hits[i] += surges[i];
                surges[i] = 0;
              }
            }
            else if (surgeTokenOVar>0){
              if (surgeTokenO>sumArr(surges)) x = sumArr(surges);
              else x = surgeTokenO;
              for (var i=0; i<x; i++){
                for (var j=2; j>-1; j--){
                  if (surges[j]>0){
                    hits[j] += 1;
                    surges[j] -= 1;
                    surgTokenOVar -= 1;
                    break;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  totalHits = sumArr(hits);
  totalCrits = sumArr(crits);
  ///////////////////////////APPLY DODGE AND COVER////////////////////////////////
  totalHits -= cover;
  if (outmanuever && dodges>0){
    if (totalCrits>dodges){
      totalCrits -= dodges;
      dodges = 0;
    }
    else{
      dodges -= totalCrits;
      totalCrits = 0;
    }
  }
  totalHits -= dodges;
  ///////////////////////////MODIFY ATTACK DICE///////////////////////////////////
  //marksman, ram, impact
  if (ram>0){
    if (sumArr(blanks)>ram) totalCrits += ram;
    else totalCrits += sumArr(blanks);
  }
  if (armor || armorx>0){
    totalCrits += Math.min(totalHits, impact + weakpoint);
    totalHits -= Math.min(totalHits, impact + weakpoint);
    if (armor) totalHits = 0;
    else totalHits -= armorx;
  }
  if (totalHits<0) totalHits = 0;
  ///////////////////////////ROLL/CONVERT DEFENSE DICE////////////////////////////
  //shielded, uncanny luck, danger sense
  //starting the defensive pool with impervious
  if (impervious) x = pierce;
  else x=0;
  x += totalHits + totalCrits + dangerSense - shielded;
  diceTrayD = diceArray(x,6);
  surgeTokenDVar = surgeTokenD;

  totalBlocks = countRange(diceTrayD,1,defense);
  totalSurges = countSingle(diceTrayD,6);

  if (surgeD==1){
    totalBlocks += totalSurges;
    totalSurges = 0;
  }
  else{
    y = Math.min(totalSurges, surgeTokenDVar);
    totalBlocks += y;
    totalSurges -= y;
    surgeTokenDVar -= y;
  }

  //uncanny luck and surge token decision...
  if (uncannyLuck>0){
  //easiest just to reroll blanks
  //but if not enough blanks, by now there are either no surge tokens, or no surges.
  //so everything that's not in totalBlocks is dead weight
    z = Math.min(uncannyLuck, x - totalBlocks);
    diceTrayU = diceArray(z,6);
  //convert again. with chart and/or tokens
    totalBlocks += countRange(diceTrayU,1,defense);
    totalSurges += countSingle(diceTrayU,6);
    if (surgeD==1){
      totalBlocks += totalSurges;
      totalSurges = 0;
    }
    else{
      y = Math.min(totalSurges, surgeTokenDVar);
      totalBlocks += y;
      totalSurges -= y;
      surgeTokenDVar -= y;
    }
  }

  wounds[k] = totalHits + totalCrits - Math.max(shielded, totalBlocks - pierce);
}

var woundsArr = [];
var max = wounds.reduce((a,b) => Math.max(a,b));

for (var i=0; i<max; i++) woundsArr[i] = countSingle(wounds,i);
averageWounds = sumArr(wounds)/iterations;

console.log(woundsArr, averageWounds);

/////////////////////////////////FUNCTIONS//////////////////////////////////////
//sums an array
function sumArr(arr){
  return arr.reduce(function(a,b){
    return a + b
  }, 0);
}
//count hits
function countRange(arr, small, big){
  return arr.filter((x)=>((x>=small)&&(x<=big))).length
}
//counts crits and surges
function countSingle(arr, num){
  return arr.filter((x)=>(x==num)).length
}
//random dice array function
function diceArray(size, faces){
  var arr = []
  for(var i=0; i<size; i++) arr.push(Math.floor(Math.random()*faces + 1));
  return arr
}
