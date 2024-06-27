from flask import Flask, request, jsonify
import os
from knowledgebase import load_documents_use_case, upload_documents_use_case, request_indexing_use_case
from langchain.text_splitter import RecursiveCharacterTextSplitter
import settings

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/process_rag', methods=['POST'])
def process_rag():
    data = request.json
    directory = data.get('directory')
    chunk_size = data.get('chunk_size', 8000)
    chunk_overlap = data.get('chunk_overlap', 100)

    if not directory or not os.path.exists(directory):
        return jsonify({'error': 'Invalid directory path'}), 400

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function=len,
        is_separator_regex=False,
    )

    try:
        documents = load_documents_use_case.execute(directory, text_splitter)
        print(f"Documents: {documents}")
        if not documents:
            return jsonify({'error': 'No documents to process'}), 400
        cid = upload_documents_use_case.execute(documents)
        print(f"CID: {cid}")
        response = request_indexing_use_case.execute(cid)
        print(f"Response: {response}")

        if response.is_processed and response.index_cid:
            return jsonify({
                'message': 'Knowledge base indexed successfully',
                'index_cid': response.index_cid,
                'cid': cid
            })
        else:
            return jsonify({'error': response.error or 'Failed to index knowledge base'}), 500
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
