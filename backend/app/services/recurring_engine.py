from sqlalchemy.orm import Session
from datetime import date, timedelta
from models.AccountModel import Account
from models.ExpenseModel import Expense
from models.RecurringTransModel import RecurringTransaction
from models.InvestmentModel import Investment  # ✅ NEW IMPORT


def calculate_next_due_date(current_due: date, frequency: str) -> date:
    if frequency == "daily":
        return current_due + timedelta(days=1)

    if frequency == "weekly":
        return current_due + timedelta(weeks=1)

    if frequency == "monthly":
        next_month = current_due.month % 12 + 1
        year = current_due.year + (current_due.month // 12)
        return current_due.replace(year=year, month=next_month)

    if frequency == "yearly":
        return current_due.replace(year=current_due.year + 1)

    return current_due + timedelta(days=30)  # fallback


def execute_recurring_transactions(db: Session):
    today = date.today()

    due_transactions = (
        db.query(RecurringTransaction)
        .filter(
            RecurringTransaction.is_active == True
        )
        .all()
    )

    results = []

    for txn in due_transactions:
        account = db.query(Account).filter(Account.id == txn.account_id).first()

        if not account:
            results.append(f"Skipped {txn.title} (No account)")
            continue

        try:
            if txn.amount > 0:
                account.balance += txn.amount
                action = "credited"

            else:
                expense = Expense(
                    user_id=txn.user_id,
                    account_id=txn.account_id,
                    amount=abs(txn.amount),
                    category=txn.category,
                    payment_method="auto",
                    expense_date=today,
                    notes=f"Auto: {txn.title}",
                    is_auto_generated=True
                )

                db.add(expense)
                account.balance -= abs(txn.amount)
                action = "debited"

                if txn.category in ["SIP", "Saving", "Investment"]:

                    existing = (
                        db.query(Investment)
                        .filter(
                            Investment.recurring_id == txn.id,
                            Investment.investment_date == today
                        )
                        .first()
                    )

                    if not existing:
                        investment = Investment(
                            user_id=txn.user_id,
                            goal_id=txn.goal_id,  # ✅ LINKED
                            title=txn.title,
                            type=txn.category,
                            amount=abs(txn.amount),
                            investment_date=today,
                            source="RECURRING",
                            recurring_id=txn.id
                        )

                        db.add(investment)

            # 🔁 Roll next due date
            txn.next_due_date = calculate_next_due_date(
                txn.next_due_date, txn.frequency
            )

            results.append(f"{txn.title} {action}")

        except Exception as e:
            results.append(f"Failed {txn.title}: {str(e)}")

    db.commit()
    return results
