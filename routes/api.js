'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = function (app) {

  // Conecta ao MongoDB
  const CONNECTION_STRING = process.env.MONGO_URI || 'mongodb://localhost:27017/issue-tracker';
  mongoose.connect(CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado ao MongoDB'))
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err));


  // Define o schema da issue
  const issueSchema = new Schema({
    issue_title: { type: String, required: true },
    issue_text: { type: String, required: true },
    created_by: { type: String, required: true },
    assigned_to: { type: String, default: "" },
    status_text: { type: String, default: "" },
    created_on: { type: Date, default: Date.now },
    updated_on: { type: Date, default: Date.now },
    open: { type: Boolean, default: true },
    project: { type: String }
  });

  const Issue = mongoose.model('Issue', issueSchema);

  app.route('/api/issues/:project')

    // GET: retorna todas as issues de um projeto, com ou sem filtros
    .get(async function (req, res) {
      try {
        const project = req.params.project;
        let query = req.query;
        query.project = project;

        const issues = await Issue.find(query);
        return res.json(issues);
      } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error', details: err.message });
      }
    })


    // POST: cria uma nova issue
    .post(async function (req, res) {
      try {
        const project = req.params.project;
        const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;

        // Verifica campos obrigatórios
        if (!issue_title || !issue_text || !created_by) {
          return res.json({ error: 'required field(s) missing' });
        }

        const newIssue = new Issue({
          issue_title,
          issue_text,
          created_by,
          assigned_to: assigned_to || "",
          status_text: status_text || "",
          created_on: new Date(),
          updated_on: new Date(),
          open: true,
          project
        });

        // Salvando a issue no banco
        const savedIssue = await newIssue.save();

        return res.status(200).json(savedIssue);
      } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error', details: err.message });
      }
    })

    // PUT: atualiza campos de uma issue existente

    .put(async function (req, res) {
      try {
        const { _id, issue_title, issue_text, created_by, assigned_to, status_text, open } = req.body;

        if (!_id) {
          return res.json({ error: 'missing _id' });
        }

        // Verifica se o _id tem um formato válido
        if (!mongoose.Types.ObjectId.isValid(_id)) {
          return res.status(200).json({ error: 'could not update', _id });
        }

        let updateFields = {};
        if (issue_title) updateFields.issue_title = issue_title;
        if (issue_text) updateFields.issue_text = issue_text;
        if (created_by) updateFields.created_by = created_by;
        if (assigned_to) updateFields.assigned_to = assigned_to;
        if (status_text) updateFields.status_text = status_text;
        if (open !== undefined) updateFields.open = open;

        if (Object.keys(updateFields).length === 0) {
          return res.json({ error: 'no update field(s) sent', '_id': _id });
        }

        updateFields.updated_on = new Date();

        const updatedIssue = await Issue.findByIdAndUpdate(_id, updateFields, { new: true });

        if (!updatedIssue) {
          return res.status(200).json({ error: 'could not update', _id });
        }

        return res.json({ result: 'successfully updated', '_id': _id });
      } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error', details: err.message });
      }
    })

    // DELETE: remove uma issue
    .delete(async function (req, res) {
      try {
        const { _id } = req.body;

        if (!_id) {
          return res.json({ error: 'missing _id' });
        }

        // Verifica se o _id tem um formato válido
        if (!mongoose.Types.ObjectId.isValid(_id)) {
          return res.status(200).json({ error: 'could not delete', _id });
        }

        const removedIssue = await Issue.findByIdAndDelete(_id);

        if (!removedIssue) {
          return res.status(200).json({ error: 'could not delete', _id });
        }

        return res.json({ result: 'successfully deleted', '_id': _id });
      } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error', details: err.message });
      }
    })


};
