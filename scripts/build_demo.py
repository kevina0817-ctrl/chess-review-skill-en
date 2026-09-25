#!/usr/bin/env python3
# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Build fictional, legal teaching reviews for public feature screenshots."""
import argparse, json, sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SKILL=ROOT/'plugins/chess-review-en/skills/chess-review-open-en'
sys.path.insert(0,str(SKILL/'scripts'))
from build_review import build
from build_leaks import merge, read_payload, validate, verified_review_info
from plan_common_leaks import plan


def lesson(ply,title,why,fix,better,actual=2,positive=False):
    return dict(ply=ply,tag='Demo good move' if positive else 'Demo lesson',title=title,summary=why,
                why=why,fix=fix,habit='Check the opponent’s checks and captures before choosing your move.',
                hint='Find the opponent’s target and a piece that can protect it.',actual_plies=actual,
                better=better,positive=positive)


def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--out',type=Path,required=True);a=parser.parse_args()
    a.out.mkdir(parents=True,exist_ok=True)
    if list(a.out.glob('*.pgn')) or (a.out/'common-leaks.html').exists():
        parser.error('Use an empty demo directory; never overwrite a review archive.')
    entries=[
      ('ExampleA','black','1. e4 e5 2. Qh5 Nc6 3. Bc4 Nf6 4. Qxf7# 1-0',
       lesson(5,'Stop the queen-and-bishop attack on f7','In this example, Nf6 fails to stop the queen on h5 and bishop on c4. Qxf7# follows.','g6 chases the queen; after the illustrative Qf3, Nf6 blocks the f-file.',['g6','Qf3','Nf6'])),
      ('ExampleB','black','1. e4 e5 2. Bc4 Nc6 3. Qf3 b6 4. Qxf7# 1-0',
       lesson(5,'The same leak appears in another position','The example move b6 ignores the mating threat on f7.','Nf6 blocks the queen’s path from f3 to f7.',['Nf6','Nc3','Bc5'])),
      ('ExampleC','white','1. e4 d5 2. Qh5 Nf6 3. Qxd5 Nxd5 0-1',
       lesson(4,'Before taking a pawn, check who can take your queen','White takes the d5 pawn, then loses the queen to the knight on f6.','Qe2 saves the queen instead of trading it for a pawn.',['Qe2','Nc6','Nf3'])),
      ('ExampleD','black','1. e4 e5 2. Qh5 Nc6 3. Bc4 g6 4. Qf3 Nf6 5. Ne2 Bg7 6. d3 O-O 1/2-1/2',
       lesson(5,'This time, address the f7 threat first','In the later fictional example, the learner plays g6 to chase the queen and Nf6 to block the f-file.','These actual example moves—g6, Qf3, Nf6—demonstrate the progress feature.',['g6','Qf3','Nf6'],actual=3,positive=True))
    ]
    # Ten deliberately fictional records demonstrate the same real first-run gate.
    for i in range(4,10):
        entries.append((f'Example{chr(65+i)}','white','1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. O-O Nf6 1/2-1/2',
                        lesson(2,'Develop a knight first','Nf3 develops a piece and attacks the e5 pawn.','Keep this sound development habit; not every game needs a leak label.',['Nf3'],actual=1,positive=True)))
    stems=[]
    for i,(opponent,color,moves,item) in enumerate(entries,1):
        date=f'2000-01-{i:02d}';stem=date+'_'+opponent;stems.append(stem)
        white,black=('Learner',opponent) if color=='white' else (opponent,'Learner')
        result=moves.split()[-1]
        pgn=f'[Event "Fictional teaching demo"]\n[Site "Local demo"]\n[Date "{date.replace("-",".")}"]\n[White "{white}"]\n[Black "{black}"]\n[Result "{result}"]\n\n{moves}\n'
        source=a.out/(stem+'.pgn');source.write_text(pgn)
        cfg=dict(archive_date=date,timezone='UTC',user_color=color,intro='Fictional teaching example, not a real user’s game.',
            overview=['All ten records are fictional, legal teaching games.'],strengths=['Good moves are described from each game’s actual play.'],training=[dict(title='Check threats first',text='Check the opponent’s checks and direct captures.')],
            review_guide='Compare the actual example moves and the suggestion on the board.',ending='The teaching game ends with its stated result; it is not a real online game.',
            provenance='Fictional data; moves validated with python-chess, simple tactics checked manually. No engine analysis claimed.',date_note='Dates in 2000 are for example ordering only.',lessons=[item])
        config=a.out/(stem+'.json');config.write_text(json.dumps(cfg,ensure_ascii=False))
        build(source,config,a.out/'generated')
        (a.out/(stem+'.html')).write_bytes((a.out/'generated'/(stem+'.html')).read_bytes())
    case_specs=[
      (0,'direct-threats','Queen and bishop aim at f7',
       ['Same starting position: the queen on h5 and bishop on c4 both attack f7.','Actual Nf6 leaves the threat on f7 intact.','Qxf7#: the bishop protects the queen, so the king cannot capture it.'],
       ['Start from the same position and address the f7 threat.','g6 chases the queen and blocks its diagonal to f7.','Illustrative Qf3: the queen switches to another line toward f7.','Nf6 blocks the f-file and stops the immediate mating threat.'],
       'Nf6 ignores the f7 threat and allows mate next move.','Play g6 to chase the queen, then Nf6 to block its new line.'),
      (1,'direct-threats','A different position, the same f7 oversight',
       ['The queen on f3 and bishop on c4 attack f7.','Actual b6 ignores the mating threat.','Qxf7#: the same problem appears in a different example.'],
       ['Same starting position: block the queen’s line first.','Nf6 places the knight on the f-file.','Illustrative Nc3 develops White’s knight.','Black plays Bc5; the immediate mating threat is gone.'],
       'b6 leaves f7 undefended against the queen’s mating attack.','Nf6 blocks the queen before developing other pieces.'),
      (2,'recapture','Win a pawn, lose the queen',
       ['The pawn on d5 can be captured, but the knight on f6 also protects d5.','Actual Qxd5 captures a pawn.','Nxd5 captures the queen that just landed on d5.'],
       ['Same starting position: check who protects d5.','Qe2 moves the queen to safety.','Illustrative reply: Nc6.','White develops with Nf3; the queen is still safe.'],
       'Qxd5 wins a pawn but allows the knight to capture the queen.','Keep the queen safe with Qe2, then develop.')]
    groups=[dict(id='direct-threats',title='Missing the opponent’s direct threat',short='Check threats first',desc='Pause your plan: what can the opponent capture, and where can they check?',habit='Before moving, check the opponent’s checks, mate-in-one threats and captures.'),
            dict(id='recapture',title='Counting your capture, missing the recapture',short='Calculate the reply',desc='After you capture, what is the opponent’s strongest response?',habit='Calculate three steps: my move, their response, then my next move.')]
    cases=[]
    for i,group,title,actual,better,why,fix in case_specs:
        cases.append(dict(stem=stems[i],ply=entries[i][3]['ply'],group_id=group,title=title,
                          contrast=dict(actual=why,better=fix),captions=dict(actual=actual,better=better)))
    cases[0]['arrows']={'actual':{'0':[['h5','f7'],['c4','f7']],'1':[['h5','f7'],['c4','f7']]},'better':{'0':[['h5','f7'],['c4','f7']]}}
    progress=[dict(kind='comparison',title='This time, you stopped the f7 threat',skill='Recognizing an immediate mating threat',
        explanation='Two fictional examples show the same skill: the earlier record misses f7; the later one chases the queen and blocks its new line. Real reviews use the learner’s own verified games.',
        habit='Stop an immediate mating threat before continuing development.',limit='Demo data, not evidence of a real user’s progress. One success does not establish a reliable habit.',
        prior=dict(stem=stems[0],ply=5,captions=case_specs[0][3]),
        current=dict(stem=stems[3],ply=5,captions=case_specs[0][4]))]
    update=dict(groups=groups,cases=cases,progress=progress,assessments=[dict(stem=s,outcome='existing' if i<3 else 'none',note='Fictional teaching demo, checked for screenshot generation.') for i,s in enumerate(stems)])
    (a.out/'leaks-update.json').write_text(json.dumps(update,ensure_ascii=False,indent=2))
    batch=plan(a.out,'Learner',True)
    assert batch['status']=='ready' and len(batch['selected'])==10
    (a.out/'leaks-plan.json').write_text(json.dumps(batch,ensure_ascii=False,indent=2))
    import subprocess
    subprocess.run([sys.executable,str(SKILL/'scripts/build_leaks.py'),str(a.out),'--user','Learner','--plan',str(a.out/'leaks-plan.json'),'--merge',str(a.out/'leaks-update.json')],check=True)
    subprocess.run([sys.executable,str(SKILL/'scripts/build_library.py'),str(a.out)],check=True)
    page=a.out/'common-leaks.html';html=page.read_text();html=html.replace('<nav class="top">','<p style="font-size:13px;color:#617168;margin:0 0 16px">Demo data · 10 fictional teaching games · Not real user records</p><nav class="top">',1);page.write_text(html)
    print(json.dumps({'demo':str(page),'reviewed_games':10,'cases':3,'progress':1}))


if __name__=='__main__':main()
