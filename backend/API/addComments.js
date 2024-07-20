const express = require('express');
const mongoose = require('mongoose');
const Comment = require('../schema/comments');

const addCommentHandler = async (req, res) => {
    try {
        const { resumeId } = req.params;
        const { user, comment, highlightedText, position } = req.body;

        // Check if resumeId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(resumeId)) {
            return res.status(400).json({ error: 'Invalid resume ID format' });
        }

        console.log({ resumeId, user, comment, highlightedText, position }); // Log incoming data

        const newComment = new Comment({
            resumeId,
            user,
            comment,
            highlightedText,
            position
        });

        const savedComment = await newComment.save();
        res.status(201).json(savedComment);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Error adding comment' });
    }
};

module.exports = addCommentHandler;
