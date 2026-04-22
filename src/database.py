import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import NullPool
from config import DB_URI

# NullPool disables connection pooling — ideal for SQLite in dev
engine = create_engine(DB_URI, echo=False, poolclass=NullPool)
Session = sessionmaker(bind=engine)
Base = declarative_base()

class Analysis(Base):
    __tablename__ = "analysis"
    id       = Column(Integer, primary_key=True)
    filename = Column(String(255))
    result   = Column(Text)

def init_db():
    Base.metadata.create_all(engine)

def save_analysis(filename, result):
    session = Session()
    try:
        entry = Analysis(filename=filename, result=str(result))
        session.add(entry)
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()   # ← always release the connection

def get_all_records():
    session = Session()
    try:
        records = session.query(Analysis).order_by(Analysis.id.desc()).all()
        return records
    finally:
        session.close()   # ← always release the connection