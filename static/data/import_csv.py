#Import CSV to Postgresql 

import psycopg2
import pandas as pd

conn = psycopg2.connect(host='localhost', port='5434', dbname='homework_users')
cur = conn.cursor()

df_users = pd.read_csv('predefined_users.csv', index_col=0)
for idx, u in df_users.iterrows():
    cur.execute('''INSERT INTO users (username, first_name, last_name, prog_lang, experience_yr, age, hw1_hrs)
    VALUES (%s, %s, %s, %s, %s, %s, %s)''', (u.username, u.first_name, u.last_name, u.prog_lang, u.experience_yr, u.age,
                                             u.hw1_hrs))
    conn.commit()

cur.close()
conn.close()