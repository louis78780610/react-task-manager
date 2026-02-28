import { useMemo, useState } from "react";
import { useTasks } from "./useTasks";
import type { TaskStatus } from "./types";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const statusLabel: Record<TaskStatus | "all", string> = {
  all: "全て",
  todo: "未着手",
  doing: "進行中",
  done: "完了",
};

const statusColor: Record<TaskStatus, "default" | "warning" | "info" | "success"> = {
  todo: "warning",
  doing: "info",
  done: "success",
};

export const TaskPage = () => {
  const { tasks, addTask, removeTask, updateStatus, query, setQuery, status, setStatus } = useTasks();
  const [title, setTitle] = useState("");

  const counts = useMemo(() => {
    const base = { todo: 0, doing: 0, done: 0 };
    for (const t of tasks) base[t.status] += 1;
    return base;
  }, [tasks]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            React Task Manager
          </Typography>
          <Typography variant="body2" color="text.secondary">
            React + TypeScript + Vite + MUI
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          <Chip label={`${statusLabel.todo}: ${counts.todo}`} color="warning" variant="outlined" />
          <Chip label={`${statusLabel.doing}: ${counts.doing}`} color="info" variant="outlined" />
          <Chip label={`${statusLabel.done}: ${counts.done}`} color="success" variant="outlined" />
        </Stack>

        <Card variant="outlined">
          <CardContent>
            <Stack spacing={2}>
              {/* 追加 */}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <TextField
                  fullWidth
                  label="タスクを追加"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addTask(title);
                      setTitle("");
                    }
                  }}
                />
                <Button
                  variant="contained"
                  onClick={() => {
                    addTask(title);
                    setTitle("");
                  }}
                  sx={{ minWidth: 120 }}
                >
                  追加
                </Button>
              </Stack>

              {/* Filter */}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <TextField
                  fullWidth
                  label="検索"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <FormControl sx={{ minWidth: 160 }}>
                  <InputLabel id="status-filter-label">Status</InputLabel>
                  <Select
                    labelId="status-filter-label"
                    label="Status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TaskStatus | "all")}
                  >
                    {Object.keys(statusLabel).map((k) => (
                      <MenuItem key={k} value={k}>
                        {statusLabel[k as TaskStatus | "all"]}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>

              <Divider />

              {/* List */}
              <Stack spacing={1}>
                {tasks.length === 0 ? (
                  <Typography color="text.secondary">タスクはまだありません。</Typography>
                ) : (
                  tasks.map((t) => (
                    <Card key={t.id} variant="outlined" sx={{ borderRadius: 2 }}>
                      <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={1}
                          alignItems={{ sm: "center" }}
                          justifyContent="space-between"
                        >
                          <Box sx={{ minWidth: 0 }}>
                            <Typography fontWeight={600} noWrap>
                              {t.title}
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                              <Chip size="small" label={statusLabel[t.status]} color={statusColor[t.status]} />
                              <Typography variant="caption" color="text.secondary">
                                {new Date(t.createdAt).toLocaleString()}
                              </Typography>
                            </Stack>
                          </Box>

                          <Stack direction="row" spacing={1} alignItems="center">
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                              <InputLabel id={`status-${t.id}`}>Status</InputLabel>
                              <Select
                                labelId={`status-${t.id}`}
                                label="Status"
                                value={t.status}
                                onChange={(e) => updateStatus(t.id, e.target.value as TaskStatus)}
                              >
                                <MenuItem value="todo">{statusLabel.todo}</MenuItem>
                                <MenuItem value="doing">{statusLabel.doing}</MenuItem>
                                <MenuItem value="done">{statusLabel.done}</MenuItem>
                              </Select>
                            </FormControl>

                            <Button
                              variant="outlined"
                              color="error"
                              startIcon={<DeleteOutlineIcon />}
                              onClick={() => removeTask(t.id)}
                            >
                              削除
                            </Button>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))
                )}
              </Stack>

              <Typography variant="caption" color="text.secondary">
                データはLocalStorageに保存されます。
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
};