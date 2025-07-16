import React, { useState, useRef, useEffect} from "react";
import styles from "./contentForm.module.css"; // contentForm.module.css 임포트
// Toast UI Editor imports
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css'; // Editor's default style

// Check 아이콘 컴포넌트 (사용자 코드에 정의되지 않아 임시 SVG로 대체)
const CheckIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const ContentFormPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubscriberOnly, setIsSubscriberOnly] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);

  // Toast UI Editor 인스턴스에 접근하기 위한 ref
  const editorRef = useRef(null);

  /// ---------- 카테고리 드롭다운 관련

  const categories = ["개발", "디자인", "데이터", "기획", "커리어"];
  
  // 카테고리 선택 핸들러 (다중 선택 토글)
  const handleCategorySelect = (category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        // 이미 선택된 카테고리라면 제거
        return prev.filter(c => c !== category);
      } else {
        // 선택되지 않은 카테고리라면 추가
        return [...prev, category];
      }
    });
    // 선택 후 드롭다운을 닫지 않음 (사용자 요청 반영)
  };

  // 선택된 카테고리 태그 제거 핸들러
  const removeCategoryTag = (categoryToRemove) => {
    setSelectedCategories(prev => prev.filter(c => c !== categoryToRemove));
  };

  // 드롭다운 외부 클릭 감지를 위한 ref
  const dropdownRef = useRef(null);

  // 드롭다운 외부 클릭 시 닫히는 로직
  useEffect(() => {
    const handleClickOutside = (event) => {
      // 드롭다운이 열려 있고, 클릭된 요소가 드롭다운 내부에 포함되지 않는 경우 닫기
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    // mousedown 이벤트 리스너 추가
    document.addEventListener('mousedown', handleClickOutside);
    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]); // dropdownRef가 변경될 때마다 useEffect 재실행 (초기 렌더링 시 한 번만 실행)

  // ------------ 파일 업로드 핸들러
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      setAttachedFiles(prev => [...prev, {
        id: Date.now() + Math.random(), // 고유 ID 생성
        name: file.name
      }]);
    });
  };

  // 파일 삭제 핸들러
  const removeFile = (fileId) => {
    setAttachedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  // 저장 버튼 핸들러
  const handleSave = () => {
    // Toast UI Editor에서 현재 마크다운 콘텐츠를 가져옵니다.
    const editorInstance = editorRef.current.getInstance();
    const markdownContent = editorInstance.getMarkdown();

    console.log("저장:", { title, content: markdownContent, isSubscriberOnly, selectedCategories, attachedFiles });
    // 여기에 실제 저장 로직 (예: API 호출)을 구현합니다.
  };

  // 작성 취소 버튼 핸들러
  const handleCancel = () => {
    console.log("작성 취소");
    // 폼 필드 및 에디터 내용 초기화
    setTitle('');
    setContent(''); // content 상태 초기화
    setIsSubscriberOnly(false);
    setSelectedCategories([]);
    setAttachedFiles([]);
    if (editorRef.current) {
      editorRef.current.getInstance().setMarkdown(''); // 에디터 내용 초기화
    }
  };

  return (
    <div className={styles.contentFormPageContainer}> {/* 새로운 클래스 적용 */}

      {/* 상단 토글 및 카테고리 섹션 */}
      <div className={styles.selectionSection}>
        {/* 토글 스위치*/}
         <div className={styles.toggleWrapper}>
          <label
            className={styles.toggleLabelContainer}
            onClick={() => setIsSubscriberOnly(prev => !prev)} // label 클릭 시 상태 토글
          >
            {/* 토글 스위치 시각적 요소 */}
            <div className={`${styles.toggleSwitch} ${isSubscriberOnly ? styles.toggleSwitchActive : ''}`}>
              <div className={styles.toggleSwitchHandle}></div>
            </div>
            <span className={styles.toggleLabel}>구독자 전용</span>
          </label>
        </div>

        {/* 카테고리 드롭다운 */}
        <div className={styles.dropdownWrapper} ref={dropdownRef}> {/* ref 연결 */}
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={styles.dropdownHovered}
            aria-expanded={isDropdownOpen} // 접근성을 위해 aria-expanded 속성 추가
          >
            <div className={styles.overlapGroup}>
              <span className={styles.selectedText}>
                {selectedCategories.length > 0 ? "카테고리 선택됨" : "카테고리"} {/* 선택된 카테고리가 있으면 텍스트 변경 */}
              </span>
              <div className={styles.chevrondownIcon}>
                <svg className={styles.vector} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </button>

          {isDropdownOpen && (
            <div className={styles.dropdownList}>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={styles.listItem}
                >
                  <div className={`${styles.checkBox} ${selectedCategories.includes(category) ? styles.checkBoxActive : ''}`}>
                    {selectedCategories.includes(category) && (
                      <svg className={styles.checkMarkIcon} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  {/* 모든 카테고리에 styles.optionText를 적용하여 로직 단순화 */}
                  <span className={styles.optionText}>
                    {category}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

        {/* 선택된 카테고리 태그 표시 영역 */}
        <div className={styles.selectedCategoryTags}>
          {selectedCategories.map((category) => (
            <div key={category} className={styles.categoryTag}>
              <span className={styles.categoryTagText}>{category}</span>
              <button onClick={() => removeCategoryTag(category)} className={styles.removeTagButton}>
                ×
              </button>
            </div>
          ))}
        </div>

      {/* 제목 입력 섹션 */}
      <div className={styles.titleInput}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          className={styles.labelText} // placeholder 텍스트에 스타일 적용
        />
        <div className={styles.line}></div> {/* 제목 입력 하단 라인 */}
      </div>

      
{/* 콘텐츠 입력 영역 - Toast UI Editor로 대체 */}
      <div className={styles.editorArea}> {/* editorArea는 컨테이너 스타일링을 위해 유지 */}
        <Editor
          ref={editorRef}
          initialValue={content} // content 상태를 초기값으로 사용
          placeholder="내용을 입력하세요"
          previewStyle="vertical" // 'vertical' 또는 'tab'
          height="300px" // 에디터 높이 설정
          initialEditType="wysiwyg" // 'wysiwyg' 또는 'markdown'
          // 에디터 툴바 아이템 설정 (원하는 아이템만 포함)
          toolbarItems={[
            ['heading', 'bold', 'italic', 'strike'],
            ['hr', 'quote'],
            ['ul', 'ol', 'task', 'indent', 'outdent'],
            ['table', 'image', 'link'],
            ['code', 'codeblock'],
            ['scrollSync'],
          ]}
          onChange={() => {
            // 에디터 내용 변경 시마다 content 상태를 업데이트할 필요는 없습니다.
            // 저장 버튼 클릭 시 editorRef를 통해 최신 내용을 가져올 수 있습니다.
          }}
        />
      </div>

     {/* 썸네일 이미지 드래그앤드랍 영역 */}
<div className={styles.dragAndDropArea}>
  <div className={styles.dragAndDropContent}>
    <svg className={styles.dragAndDropIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
    <p className={styles.dragAndDropText}>drag and drop</p>
    <p className={styles.dragAndDropSubText}>썸네일 이미지를 드래그앤드랍하세요.</p>
  </div>
</div>

{/* 첨부파일 섹션 - 항상 렌더링 */}
      <div className={styles.fileSection}>
        <div className={styles.headerSection2}>
          <h3 className={styles.titleText}>첨부파일</h3>
          <div className={styles.overlapGroupWrapper}>
          </div>
        </div>

        {/* 파일 업로드 input & 버튼 (첨부파일 섹션 내부로 이동) */}
        <div className={styles.uploadControlWrapper}>
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className={styles.fileSelectButton} // 파란색 버튼 하나만 남기도록 이 클래스 사용
          >
            파일 선택
          </label>
        </div>

        {/* 파일 목록 */}
        <div className={styles.fileItemListWrapper}>
          <div className={styles.fileItemList}>
            {attachedFiles.length > 0 ? (
              attachedFiles.map((file) => (
                <div key={file.id} className={styles.fileItem}>
                  <span className={styles.fileTitleText}>{file.name}</span>
                  <button
                    onClick={() => removeFile(file.id)}
                    className={styles.deleteButton}
                  >
                    ×
                  </button>
                </div>
              ))
            ) : (
              <p className={styles.emptyFileText}>첨부된 파일이 없습니다.</p>
            )}
          </div>
        </div>
      </div>

      {/* 하단 버튼 섹션 */}
      <div className={styles.footerSection}>
        {/* Anima CSS의 라인 이미지는 footerSection 내부에 절대 위치로 지정되어 있습니다. */}
        <img
          className={styles.img}
          alt="Line"
          src="https://c.animaapp.com/md45uvjzPxvxqT/img/line-5.svg"
        />
        <button
          onClick={handleCancel}
          className={styles.cancelButton}
        >
          <span className={styles.textWrapper2}>작성취소</span>
        </button>
        <button
          onClick={handleSave}
          className={styles.storeButton}
        >
          <span className={styles.textWrapper3}>저장</span>
          <CheckIcon className={styles.checkInstance} />
        </button>
      </div>
    </div>
  );
};

export default ContentFormPage;
