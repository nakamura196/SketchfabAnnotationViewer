// Sketchfab Viewerを埋め込むためのiframeを取得
const iframe = document.getElementById('api-frame');
const client = new Sketchfab(iframe);

const urlParams = new URLSearchParams(window.location.search);
// SketchfabモデルIDを指定
const modelId = urlParams.get('id') || '02add905e79c446994f971cbcf443815'; // 'id'パラメータを取得
const pos = parseInt(urlParams.get('pos'), 10) || 0;

// APIのオプションを指定してモデルをロード
client.init(modelId, {
    success: function (api) {
        api.start();
        api.addEventListener('viewerready', function () {
            setupAnnotations(api);

            focusAnnotation(api, pos); // 最初のアノテーションにフォーカス
        });
    },
    error: function () {
        console.error('Sketchfab Viewer failed to load');
    },
});

function setupAnnotations(api) {
    api.getAnnotationList(function (err, annotations) {

        if (err) {
            console.error('Failed to fetch annotations');
            return;
        }

        // アノテーション一覧をHTMLに追加
        const annotationListContainer = document.getElementById('annotation-list');
        annotations.forEach((annotation, index) => {
            const annotationItem = document.createElement('li');
            annotationItem.textContent = annotation.name; // アノテーションタイトル
            annotationItem.addEventListener('click', () => {
                focusAnnotation(api, index); // クリック時にフォーカス
            });
            annotationListContainer.appendChild(annotationItem);
        });

    });
}
function focusAnnotation(api, annotationIndex) {
    api.gotoAnnotation(annotationIndex, {
        preventCameraAnimation: false, // アニメーションを許可
    });
    // api.showAnnotation(annotationIndex); // アノテーションを表示
    // api.showAnnotationTooltip(annotationIndex); // アノテーションツールチップを表示
}
