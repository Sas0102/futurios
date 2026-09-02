from database import SessionLocal
from models import Plan

db = SessionLocal()

plans = [
    Plan(
        name="base",
        display_name="Base Plan",
        price_per_month=None,
        limits={
            "max_agents": 1,
            "max_calls_per_month": 100,
            "max_languages": 1,
            "max_faqs": 10,
            "max_team_members": 2,
            "department_routing": False,
            "api_access": False,
            "analytics_retention_days": 7,
        },
    ),
    Plan(
        name="growth",
        display_name="Growth Plan",
        price_per_month=None,
        limits={
            "max_agents": 5,
            "max_calls_per_month": 1000,
            "max_languages": 2,
            "max_faqs": 50,
            "max_team_members": 5,
            "department_routing": True,
            "api_access": False,
            "analytics_retention_days": 30,
        },
    ),
    Plan(
        name="pro",
        display_name="Pro Plan",
        price_per_month=None,
        limits={
            "max_agents": 20,
            "max_calls_per_month": 5000,
            "max_languages": 3,
            "max_faqs": None,
            "max_team_members": 15,
            "department_routing": True,
            "api_access": True,
            "analytics_retention_days": 90,
        },
    ),
    Plan(
        name="custom",
        display_name="Custom Plan",
        price_per_month=None,
        limits={
            "max_agents": None,
            "max_calls_per_month": None,
            "max_languages": 3,
            "max_faqs": None,
            "max_team_members": None,
            "department_routing": True,
            "api_access": True,
            "analytics_retention_days": None,
        },
    ),
]

for plan in plans:
    db.add(plan)

db.commit()
print("Seeded 4 plans successfully.")
db.close()