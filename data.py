import numpy as np
import pandas as pd

# removes any data from before 2000 and after 2021

df = pd.read_csv("data/human-rights-index-vdem.csv")

df.rename(columns={'Human Rights Index': 'hri', 'World region according to OWID': 'region'}, inplace=True)

condition_a = df['Year'] >= 2000

condition_b = df['Year'] < 2022

filtered_df_a = df[condition_a]

filtered_df_a = filtered_df_a[condition_b]

filtered_df_a.rename(columns={"Human Rights Index":"hri", "World region according to OWID":"region"})

filtered_df_a.to_csv("data/hri.csv", index=False)

countries_list_hri = filtered_df_a[['Entity', 'Code']].drop_duplicates()

df = pd.read_csv("data/death-rate-from-suicides-gho.csv")

countries_list_rate = df[['Entity', 'Code']].drop_duplicates()

countries_in_both = countries_list_hri.merge(
    countries_list_rate,
    on=['Entity', 'Code'],
    how='inner'
)

countries_in_both.to_csv("data/countries.csv", index=False)

df.rename(columns={"Age-standardized death rate from self-harm among both sexes" : "rate"}, inplace=True)

df.to_csv("data/rate.csv", index=False)

column_names = ['Entity', 'Code', 'Year', 'hri', 'rate', 'region']

new_df = pd.DataFrame(columns=column_names)

for index, row in countries_in_both.iterrows():
    selected_rows_hri = filtered_df_a.loc[filtered_df_a['Entity'] == row['Entity']]
    selected_rows_rate = df.loc[df['Entity'] == row['Entity']]

    merged = pd.merge(selected_rows_hri, selected_rows_rate, on=['Entity', 'Code', 'Year'], how='inner')

    new_df = pd.concat([new_df, merged])

print(new_df)

new_df.to_csv("data/merged_data.csv", index=False)

