from database import SessionLocal
from models import Organisation, Plan, Subscription

db = SessionLocal()

base_plan = db.query(Plan).filter(Plan.name == "base").first()
if not base_plan:
    print("ERROR: Base plan not found. Run seed_plans.py first.")
    db.close()
    exit()

all_orgs = db.query(Organisation).all()
backfilled_count = 0

for org in all_orgs:
    existing_subscription = db.query(Subscription).filter(Subscription.organisation_id == org.id).first()
    if existing_subscription is None:
        new_subscription = Subscription(organisation_id=org.id, plan_id=base_plan.id)
        db.add(new_subscription)
        backfilled_count += 1
        print(f"Assigned org {org.id} ({org.name}) to Base plan")

db.commit()
print(f"\nDone. Backfilled {backfilled_count} organisation(s).")
db.close()