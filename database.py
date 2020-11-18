from app.models import User, Draft, Work
from dotenv import load_dotenv
load_dotenv()
from app import app, db

beginnings=['''I'm Nobody! Who are you?
Are you—Nobody—too?
Then there's a pair of us!
Don't tell! they'd advertise—you know!

How dreary—to be—Somebody!
How public—like a Frog!
To tell one's name—the livelong June—
To an admiring Bog!'
''',
''''Twas brillig, and the slithy toves
Did gyre and gimble in the wabe:
All mimsy were the borogoves,
And the mome raths outgrabe.

"Beware the Jabberwock, my son!
The jaws that bite, the claws that catch!
Beware the Jubjub bird, and shun The frumious Bandersnatch!"

He took his
''',
'''
I have eaten
the plums
that were in
the icebox

and which
you were probably
saving
for breakfast

Forgive me
they were delicious
so sweet
and so cold
''',
'''
Some say the world will end in fire.
Some say in ice.
From what I've tasted enough of desire
I hold with those who favor fire.
But if it had to perish twice,
I think I know enough of hate
To say that for destruction ice
Is also great
And would suffice.
''']
titles = [
    '''I'm Nobody! Who are you?''',
    'Jabberwocky',
    'This is just to say',
    'Fire and Ice']
date_createds = [
    "Sat, 14 Nov 2020 02:20:52 GMT",
    "Tue, 17 Nov 2020 01:46:49 GMT",
    "Tue, 17 Nov 2020 02:29:48 GMT",
    "Tue, 17 Nov 2020 02:36:52 GMT"]
date_updateds = [
    "Sat, 14 Nov 2020 02:57:25 GMT",
    "Tue, 17 Nov 2020 02:13:52 GMT",
    "Tue, 17 Nov 2020 02:33:04 GMT",
    "Tue, 17 Nov 2020 02:50:54 GMT"]
with open('./seed_changes.txt') as f:
    changes_arr=f.readlines()


with app.app_context():
    db.drop_all()
    db.create_all()

    demo = User(
        username='demo',
        email='demo@poems.poem',
        password="apoetrydemohownice",
        first_name='Poet',
        last_name='Demo',
        bio='I love to write poems.')
    db.session.add(demo)

    # e = User.query.filter_by(username='emily').first()
    # l = User.query.filter_by(username='cdodgson').first()
    # wcw = User.query.filter_by(username='wcw').first()
    # frost = User.query.filter_by(username='frost').first()

    # db.session.delete(e)
    # db.session.delete(l)
    # db.session.delete(wcw)
    # db.session.delete(frost)
    # db.session.commit()



    emily = User(
        username='emily',
        email='carlothedog@poems.poem',
        password='dolliealways',
        first_name='Emily',
        last_name='Dickinson',
        bio='not really a people person.',
    )

    lewis = User(
        username='cdodgson',
        email='inwonderland@poems.poem',
        password='thedodosays',
        first_name='Lewis',
        last_name='Carroll',
        bio='Imagination is the only weapon in the war with reality.'
    )

    wcw = User(
        username='wcw',
        email='wcw@poems.poem',
        password="yourboywill",
        first_name='William Carlos',
        last_name='Williams',
        bio='Sorry about the plums.')

    frost = User(
        username='frost',
        email='robertfrost@poems.poem',
        password='poetlaureatenbd',
        first_name='Robert',
        last_name='Frost',
        bio='Imagine me telling this with a sigh, somewhere ages and ages hence.',
    )

    users = [emily, lewis, wcw, frost]

    for i in range(4):
        db.session.add(users[i])
    db.session.commit()

    for i in range(4):
        draft = Draft(
            user_id=users[i].id,
            title=titles[i],
            changes=changes_arr[i],
            beginning=beginnings[i],
            date_created=date_createds[i],
            date_updated=date_updateds[i],
        )
        db.session.add(draft)
    db.session.commit()

    for i in range(4):
        draft = Draft.query.filter_by(title=titles[i]).first()
        work = Work(
            title=draft.title, user_id=draft.user_id, draft_id=draft.id,
            date_created=draft.date_created, date_updated=draft.date_updated,
            changes=draft.changes, beginning=draft.beginning)
        db.session.add(work)

    db.session.commit()
