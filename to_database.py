import pymongo

"""
{
    "lastName": "Mesaglio",
    "firstName": "Juan",
    "email": "juan.mesaglio@frba.utn.edu.ar"
}
"""
alumnos = [

]
password = ""
user = ""
db = ""
client = pymongo.MongoClient(
    f"mongodb+srv://{user}:{password}@cluster0.lc5u9.mongodb.net/{db}?retryWrites=true&w=majority")
db = client.pdep.students

for alumno in alumnos:
    if not db.find_one({"email": alumno.get('email')}):
        db.insert_one(alumno)
    else:
        print(f"{alumno.get('email')} ya estaba en la base de datos")
print("Done!")
