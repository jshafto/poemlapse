"""empty message

Revision ID: 67a3f01bb881
Revises: ed5286d3bc69
Create Date: 2020-11-10 15:59:30.568489

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '67a3f01bb881'
down_revision = 'ed5286d3bc69'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('drafts_published_id_fkey', 'drafts', type_='foreignkey')
    op.drop_column('drafts', 'published_id')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('drafts', sa.Column('published_id', sa.INTEGER(), autoincrement=False, nullable=True))
    op.create_foreign_key('drafts_published_id_fkey', 'drafts', 'works', ['published_id'], ['id'])
    # ### end Alembic commands ###
