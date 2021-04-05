import pymongo

alumnos = [
    """
    {
        "lastName": "Mesaglio",
        "firstName": "Juan",
        "email": "juan.mesaglio@frba.utn.edu.ar"
    }
    """
]
password = ""
user = ""
db=""
client = pymongo.MongoClient(f"mongodb+srv://{user}:{password}@cluster0.lc5u9.mongodb.net/{db}?retryWrites=true&w=majority")
db = client.pdep.students

for alumno in alumnos:
    db.insert_one(alumno)
print("Done!")
