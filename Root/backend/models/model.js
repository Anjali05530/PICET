const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('picet', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,

});

const User = sequelize.define('User', {
    uid: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('admin', 'evaluator'), allowNull: false },
    domain: { type: DataTypes.STRING, allowNull: true },
    approval_status: { type: DataTypes.ENUM('pending', 'approved', 'rejected'), defaultValue: 'pending' }
}, { tableName: 'users', timestamps: false });

const ResearchPaper = sequelize.define('ResearchPaper', {
    rid: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    author_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: 'uid' } },
    title: { type: DataTypes.STRING, allowNull: false },
    post_date: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    paper_file: { type: DataTypes.STRING, allowNull: false },
    domain: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'research_papers', timestamps: false });

const EvaluatorAssignment = sequelize.define('EvaluatorAssignment', {
    eaid: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    rid: { type: DataTypes.INTEGER, allowNull: false, references: { model: ResearchPaper, key: 'rid' } },
    uid: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: 'uid' } }
}, { tableName: 'evaluator_assignments', timestamps: false });

const ResearchPaperRating = sequelize.define('ResearchPaperRating', {
    rprid: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    rid: { type: DataTypes.INTEGER, allowNull: false, references: { model: ResearchPaper, key: 'rid' } },
    uid: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: 'uid' } },
    q1: { type: DataTypes.INTEGER, validate: { min: 1, max: 10 } },
    q2: { type: DataTypes.INTEGER, validate: { min: 1, max: 10 } },
    q3: { type: DataTypes.INTEGER, validate: { min: 1, max: 10 } },
    q4: { type: DataTypes.INTEGER, validate: { min: 1, max: 10 } },
    q5: { type: DataTypes.INTEGER, validate: { min: 1, max: 10 } }
}, { tableName: 'research_paper_ratings', timestamps: false });

User.hasMany(ResearchPaper, { foreignKey: 'author_id' });
ResearchPaper.belongsTo(User, { foreignKey: 'author_id' });

User.hasMany(EvaluatorAssignment, { foreignKey: 'uid' });
EvaluatorAssignment.belongsTo(User, { foreignKey: 'uid' });

ResearchPaper.hasMany(EvaluatorAssignment, { foreignKey: 'rid' });
EvaluatorAssignment.belongsTo(ResearchPaper, { foreignKey: 'rid' });

User.hasMany(ResearchPaperRating, { foreignKey: 'uid' });
ResearchPaperRating.belongsTo(User, { foreignKey: 'uid' });

ResearchPaper.hasMany(ResearchPaperRating, { foreignKey: 'rid' });
ResearchPaperRating.belongsTo(ResearchPaper, { foreignKey: 'rid' });

sequelize.sync()
    .then(() => console.log("Database & tables created!"))
    .catch(error => console.error("Error syncing database: ", error));

module.exports = { User, ResearchPaper, EvaluatorAssignment, ResearchPaperRating, sequelize };
