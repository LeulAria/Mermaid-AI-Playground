import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Typography, IconButton } from "@mui/material";
import { X } from "lucide-react";
import { Mermaid } from "./mermaid";

interface Example {
  id: string;
  title: string;
  mermaidCode: string;
  category: string;
}

const examples: Example[] = [
  {
    id: "flowchart-simple",
    title: "Simple Flowchart",
    category: "Flowchart",
    mermaidCode: `graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[End]
    D --> E`,
  },
  {
    id: "sequence-diagram",
    title: "User Login Sequence",
    category: "Sequence",
    mermaidCode: `sequenceDiagram
    participant User
    participant Client
    participant Server
    participant Database

    User->>Client: Enters credentials
    Client->>Server: Authenticate(username, password)
    Server->>Database: Query user
    Database-->>Server: User data
    Server->>Client: Authentication success/failure
    Client->>User: Show dashboard/error`,
  },
  {
    id: "state-diagram",
    title: "Traffic Light State",
    category: "State",
    mermaidCode: `stateDiagram-v2
    [*] --> Red
    Red --> Green: Timer expires
    Green --> Yellow: Timer expires
    Yellow --> Red: Timer expires`,
  },
  {
    id: "er-diagram",
    title: "Simple ER Diagram",
    category: "ER",
    mermaidCode: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER }|..|{ DELIVERY-ADDRESS : uses`,
  },
  {
    id: "class-diagram",
    title: "Basic Class Diagram",
    category: "Class",
    mermaidCode: `classDiagram
    class Animal{
        +String name
        +int age
        +void eat()
    }
    class Dog{
        +String breed
        +void bark()
    }
    Animal <|-- Dog`,
  },
  {
    id: "gantt-chart",
    title: "Project Schedule Gantt",
    category: "Gantt",
    mermaidCode: `gantt
    dateFormat  YYYY-MM-DD
    title       Project Schedule
    section Design
    Research    :a1, 2024-01-01, 7d
    Prototype   :a2, after a1, 5d
    section Development
    Coding      :b1, 2024-01-08, 10d
    Testing     :b2, after b1, 5d`,
  },
  {
    id: "pie-chart",
    title: "Market Share Pie Chart",
    category: "Pie",
    mermaidCode: `pie title Market Share
    "Product A" : 40
    "Product B" : 30
    "Product C" : 20
    "Product D" : 10`,
  },
  {
    id: "git-graph",
    title: "Git Branching",
    category: "Git",
    mermaidCode: `gitGraph
    commit
    commit
    branch develop
    commit
    commit
    branch feature
    commit
    checkout develop
    merge feature
    checkout main
    merge develop
    commit`,
  },
  {
    id: "journey-diagram",
    title: "User Journey",
    category: "Journey",
    mermaidCode: `journey
    title User Journey
    section Landing
      Visit homepage: 5: User
      Browse products: 4: User
    section Purchase
      Add to cart: 3: User
      Checkout: 5: User
      Payment: 4: User
    section Completion
      Receive confirmation: 5: User`,
  },
  {
    id: "timeline-diagram",
    title: "Project Timeline",
    category: "Timeline",
    mermaidCode: `timeline
    title Project Timeline
    section Phase 1
      Planning : Design : Requirements
    section Phase 2
      Development : Testing : Deployment
    section Phase 3
      Maintenance : Updates : Support`,
  },
  {
    id: "architecture-sample",
    title: "A sample architecture diagram",
    category: "Architecture",
    mermaidCode: `architecture-beta
    group api(cloud)[API]

    service db(database)[Database] in api
    service disk1(disk)[Storage] in api
    service disk2(disk)[Storage] in api
    service server(server)[Server] in api

    db:L -- R:server
    disk1:T -- B:server
    disk2:T -- B:db`,
  },
  {
    id: "flowchart-complex",
    title: "Complex Flowchart",
    category: "Flowchart",
    mermaidCode: `flowchart TD
    Start([Start]) --> Input[Input Data]
    Input --> Validate{Valid?}
    Validate -->|Yes| Process[Process Data]
    Validate -->|No| Error[Show Error]
    Process --> Save[(Save to Database)]
    Save --> End([End])
    Error --> End`,
  },
  {
    id: "mindmap",
    title: "Mindmap Example",
    category: "Mindmap",
    mermaidCode: `mindmap
    root((Mermaid))
      Types
        Flowchart
        Sequence
        State
        Class
      Features
        Syntax
        Themes
        Styling`,
  },
  {
    id: "kanban-board",
    title: "Kanban Board",
    category: "Kanban",
    mermaidCode: `kanban
  Todo
    [Create Documentation]
    docs[Create Blog about the new diagram]
  [In progress]
    id6[Create renderer so that it works in all cases. We also add som extra text here for testing purposes. And some more just for the extra flare.]
  id9[Ready for deploy]
    id8[Design grammar]@{ assigned: 'knsv' }
  id10[Ready for test]
    id4[Create parsing tests]@{ ticket: MC-2038, assigned: 'K.Sveidqvist', priority: 'High' }
    id66[last item]@{ priority: 'Very Low', assigned: 'knsv' }
  id11[Done]
    id5[define getData]
    id2[Title of diagram is more than 100 chars when user duplicates diagram with 100 char]@{ ticket: MC-2036, priority: 'Very High'}
    id3[Update DB function]@{ ticket: MC-2037, assigned: knsv, priority: 'High' }
  id12[Can't reproduce]
    id3[Weird flickering in Firefox]`,
  },
  {
    id: "quadrant-chart",
    title: "Quadrant Chart",
    category: "Quadrant",
    mermaidCode: `quadrantChart
    title Reach and engagement of campaigns
    x-axis Low Reach --> High Reach
    y-axis Low Engagement --> High Engagement
    quadrant-1 We should expand
    quadrant-2 Need to promote
    quadrant-3 Re-evaluate
    quadrant-4 May be improved
    Campaign A: [0.3, 0.6]
    Campaign B: [0.45, 0.23]
    Campaign C: [0.57, 0.69]
    Campaign D: [0.78, 0.34]
    Campaign E: [0.40, 0.34]
    Campaign F: [0.35, 0.78]`,
  },
  {
    id: "flowchart-with-text",
    title: "Flow Chart with Labels",
    category: "Flowchart",
    mermaidCode: `flowchart LR
  A[Start] --Some text--> B(Continue)
  B --> C{Evaluate}
  C -- One --> D[Option 1]
  C -- Two --> E[Option 2]
  C -- Three --> F[Option 3]`,
  },
];

interface ExampleDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectExample: (mermaidCode: string) => void;
}

export const ExampleDialog: React.FC<ExampleDialogProps> = ({
  open,
  onClose,
  onSelectExample,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      aria-labelledby="example-dialog-title"
      PaperProps={{
        sx: {
          maxHeight: "90vh",
          backgroundColor: "#181818",
          borderRadius: "10px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)",
          overflow: "hidden",
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(4px)",
        },
      }}
    >
      <DialogTitle
        id="example-dialog-title"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#282828",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: "1rem",
            color: "#E8EAED",
          }}
          component="span"
        >
          Showcase Examples
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          size="small"
          sx={{
            color: "#9AA0A6",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            borderRadius: "50%",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              color: "#E8EAED",
            },
            "&:active": {
              backgroundColor: "rgba(255, 255, 255, 0.12)",
            },
          }}
        >
          <X size={20} />
        </IconButton>
      </DialogTitle>
      <DialogContent
        dividers
        sx={{
          padding: "24px",
          backgroundColor: "#181818",
          "&.MuiDialogContent-dividers": {
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            borderBottom: "none",
          },
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: "16px",
          }}
        >
          {examples.map((example) => (
            <Box
              key={example.id}
              onClick={() => {
                onSelectExample(example.mermaidCode);
                onClose();
              }}
              sx={{
                borderRadius: "12px",
                padding: "16px",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                width: "100%",
                minHeight: "240px",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "2px",
                  background: "linear-gradient(90deg, transparent, rgba(66, 133, 244, 0.6), transparent)",
                  opacity: 0,
                  transition: "opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                },
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.06)",
                  borderColor: "rgba(255, 255, 255, 0.12)",
                  transform: "translateY(-2px)",
                  boxShadow:
                    "0 4px 16px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.1)",
                  "&::before": {
                    opacity: 1,
                  },
                },
                "&:active": {
                  transform: "translateY(0)",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                },
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#0D0D0D",
                  borderRadius: "8px",
                  padding: "12px",
                  height: "172px",
                  width: "100%",
                  minHeight: "172px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  marginBottom: "12px",
                  flexShrink: 0,
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                }}
              >
                <Mermaid text={example.mermaidCode} previewMode={true} />
              </Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  color: "#E8EAED",
                  textAlign: "center",
                  fontSize: "14px",
                  lineHeight: "20px",
                  letterSpacing: "0.01em",
                  fontFamily: '"Google Sans", "Roboto", "Arial", sans-serif',
                  flexGrow: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingTop: "4px",
                }}
              >
                {example.title}
              </Typography>
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          backgroundColor: "#282828",
          padding: "16px 24px",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "#9AA0A6",
              fontSize: "12px",
              fontWeight: 400,
              letterSpacing: "0.01em",
              fontFamily: '"Roboto", "Arial", sans-serif',
            }}
          >
            {examples.length} examples available
          </Typography>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

