"""empty message

Revision ID: 09790819a68a
Revises: a879e4d61729
Create Date: 2020-11-06 15:58:32.728374

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '09790819a68a'
down_revision = 'a879e4d61729'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('drafts',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=150), nullable=False),
    sa.Column('changes', sa.Text(), nullable=True),
    sa.Column('date_created', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
    sa.Column('date_updated', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('drafts')
    # ### end Alembic commands ###
