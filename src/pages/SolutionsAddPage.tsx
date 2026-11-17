import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent, FC, FormEvent } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../Routes.ts';
import { MediaPreview } from '../components/MediaPreview.tsx';
import type { Solution } from '../modules/solution.model.ts';
import { selectIsLoading, useAppDispatch, useAppSelector } from '../store/hooks.ts';
import {
  createSolutionDraft,
  fetchSolutionDraft,
  publishSolution,
} from '../store/thunks/solutions.thunks.ts';

const ERROR_TEXTS: Record<number, string> = {
  0: 'Сервер недоступен, попробуйте позже',
  400: 'Проверьте поля формы и тип файлов',
  401: 'Нужно войти',
  409: 'Черновик уже существует',
};

const useObjectUrl = (file: File | null): string | null => {
  const url = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => (url ? URL.revokeObjectURL(url) : undefined), [url]);
  return url;
};

const CreateForm: FC = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);
  const [substanceName, setSubstanceName] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const imagePreview = useObjectUrl(image);
  const videoPreview = useObjectUrl(video);

  const pickFile =
    (setFile: (file: File | null) => void) => (event: ChangeEvent<HTMLInputElement>) =>
      setFile(event.target.files?.[0] ?? null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!image || !video) return;
    void dispatch(createSolutionDraft({ substanceName, image, video }));
  };

  return (
    <Form className="form-body" onSubmit={handleSubmit}>
      <div className="preview-row">
        <MediaPreview kind="image" src={imagePreview} />
        <MediaPreview kind="video" src={videoPreview} />
      </div>

      <Form.Group controlId="new-image">
        <Form.Label className="field-label">Изображение</Form.Label>
        <Form.Control
          className="dark-input"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={pickFile(setImage)}
          required
          disabled={isLoading}
        />
      </Form.Group>
      <Form.Group controlId="new-video">
        <Form.Label className="field-label">Видео</Form.Label>
        <Form.Control
          className="dark-input"
          type="file"
          accept="video/mp4,video/quicktime,video/webm"
          onChange={pickFile(setVideo)}
          required
          disabled={isLoading}
        />
      </Form.Group>
      <Form.Group controlId="new-name">
        <Form.Label className="field-label">Название вещества</Form.Label>
        <Form.Control
          className="dark-input"
          type="text"
          maxLength={70}
          value={substanceName}
          onChange={(event) => setSubstanceName(event.target.value)}
          required
          disabled={isLoading}
        />
      </Form.Group>
      <Button type="submit" className="filter-btn form-submit" disabled={isLoading}>
        Далее
      </Button>
    </Form>
  );
};

const PublishForm: FC<{ draft: Solution }> = ({ draft }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoading = useAppSelector(selectIsLoading);
  const [description, setDescription] = useState(draft.description);
  const [molarConcentration, setMolarConcentration] = useState(
    draft.molarConcentration?.toString() ?? '',
  );
  const [ph, setPh] = useState(draft.ph?.toString() ?? '');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const result = await dispatch(
      publishSolution({
        id: draft.id,
        description,
        molarConcentration: Number(molarConcentration),
        ph: Number(ph),
      }),
    );
    if (publishSolution.fulfilled.match(result)) {
      navigate(`${ROUTES.FEED}/${result.payload.id}`);
    }
  };

  return (
    <Form className="form-body" onSubmit={handleSubmit}>
      <div className="preview-row">
        <MediaPreview kind="image" src={draft.imageUrl} />
        <MediaPreview kind="video" src={draft.videoUrl} />
      </div>

      <Form.Group controlId="draft-name">
        <Form.Label className="field-label">Название вещества</Form.Label>
        <Form.Control className="dark-input" value={draft.substanceName} readOnly />
      </Form.Group>
      <Form.Group controlId="draft-description">
        <Form.Label className="field-label">Описание</Form.Label>
        <Form.Control
          className="dark-input"
          as="textarea"
          rows={4}
          maxLength={500}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          required
          disabled={isLoading}
        />
      </Form.Group>
      <Form.Group controlId="draft-concentration">
        <Form.Label className="field-label">Молярная концентрация, моль/л</Form.Label>
        <Form.Control
          className="dark-input"
          type="number"
          min={0}
          max={99.999}
          step={0.001}
          value={molarConcentration}
          onChange={(event) => setMolarConcentration(event.target.value)}
          required
          disabled={isLoading}
        />
      </Form.Group>
      <Form.Group controlId="draft-ph">
        <Form.Label className="field-label">pH</Form.Label>
        <Form.Control
          className="dark-input"
          type="number"
          min={0}
          max={14}
          step={0.01}
          value={ph}
          onChange={(event) => setPh(event.target.value)}
          required
          disabled={isLoading}
        />
      </Form.Group>
      <Button type="submit" className="filter-btn form-submit" disabled={isLoading}>
        Опубликовать
      </Button>
    </Form>
  );
};

const SolutionsAddPage: FC = () => {
  const dispatch = useAppDispatch();
  const { draft, errorStatus } = useAppSelector((state) => state.draft);

  useEffect(() => {
    void dispatch(fetchSolutionDraft());
  }, [dispatch]);

  return (
    <div className="page-body form-screen">
      <h1 className="title">{draft ? 'Публикация раствора' : 'Новый раствор'}</h1>
      {errorStatus !== null && (
        <Alert className="form-error">
          {ERROR_TEXTS[errorStatus] ?? 'Не удалось выполнить запрос'}
        </Alert>
      )}
      {draft ? <PublishForm key={draft.id} draft={draft} /> : <CreateForm />}
    </div>
  );
};

export default SolutionsAddPage;
