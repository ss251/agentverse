from flask import Flask, request, jsonify
import os
from werkzeug.utils import secure_filename
from knowledgebase import load_documents_use_case, upload_documents_use_case, request_indexing_use_case
from langchain.text_splitter import RecursiveCharacterTextSplitter

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = '/tmp'  # Set a temporary upload folder

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/process_rag', methods=['POST'])
def process_rag():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        chunk_size = int(request.form.get('chunk_size', 8000))
        chunk_overlap = int(request.form.get('chunk_overlap', 100))

        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            length_function=len,
            is_separator_regex=False,
        )

        try:
            documents = load_documents_use_case.execute(file_path, text_splitter)
            if not documents:
                return jsonify({'error': 'No documents to process'}), 400

            cid = upload_documents_use_case.execute(documents)
            response = request_indexing_use_case.execute(cid)

            if response.is_processed and response.index_cid:
                return jsonify({
                    'message': 'Knowledge base indexed successfully',
                    'index_cid': response.index_cid,
                    'cid': cid
                })
            else:
                return jsonify({'error': response.error or 'Failed to index knowledge base'}), 500
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        finally:
            os.remove(file_path)  # Clean up the uploaded file

if __name__ == '__main__':
    app.run(debug=True)
