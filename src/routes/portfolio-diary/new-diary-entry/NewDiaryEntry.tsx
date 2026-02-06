import {useId} from "react";
import {DiaryEntry} from "#root/src/routes/portfolio-diary/types.ts";
import {NewItemView} from "#root/src/types.ts";

import './NewDiaryEntry.css';
import {Form, Stack} from "react-bootstrap";

const NewDiaryEntry = (props: NewItemView<DiaryEntry>) => {

    const {
        sourceObject,
        updateSource
    } = props;

    const titleId = useId();
    const contentId = useId();

    return (
        <Stack gap={3}>
            <Form.Group controlId={titleId}>
                <Form.Label>Title</Form.Label>
                <Form.Control
                    type='text'
                    placeholder='Title'
                    value={sourceObject.title}
                    onChange={(e) => {
                        updateSource({...sourceObject, title: e.target.value});
                    }}
                />
            </Form.Group>
            <Form.Group controlId={contentId}>
                <Form.Label>Content</Form.Label>
                <Form.Control
                    type='text'
                    as='textarea'
                    rows={4}
                    placeholder="What's the update?"
                    value={sourceObject.content}
                    onChange={(e) => {
                        updateSource({...sourceObject, content: e.target.value});
                    }}
                />
            </Form.Group>
        </Stack>
    );
}

export default NewDiaryEntry;