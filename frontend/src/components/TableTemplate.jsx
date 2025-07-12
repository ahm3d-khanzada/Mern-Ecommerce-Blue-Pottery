// Edited 
import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Card,
  CardContent,
  Divider,
} from "@mui/material"
import { motion, AnimatePresence } from "framer-motion"
import styled from "styled-components"

// Motion components
const MotionTableContainer = motion(TableContainer)
const MotionTableRow = motion(TableRow)
const MotionCard = motion(Card)

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
}

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.05,
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  }),
  hover: {
    backgroundColor: "rgba(3, 197, 219, 0.04)",
    transition: { duration: 0.2 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.05,
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  }),
  hover: {
    y: -5,
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30,
    },
  },
}

const TableTemplate = ({ buttonHaver: ButtonHaver, columns, rows, loading = false }) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  // Calculate visible rows based on pagination
  const visibleRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
        <CircularProgress size={60} sx={{ color: "#03c5db" }} />
      </Box>
    )
  }

  if (rows.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 6,
          px: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 500,
            color: "#1a365d",
            textAlign: "center",
          }}
        >
          No Data Available
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            textAlign: "center",
            maxWidth: "400px",
            mt: 1,
          }}
        >
          There are no items to display at this time.
        </Typography>
      </Box>
    )
  }

  return (
    <AnimatePresence>
      {isMobile ? (
        // Mobile card view
        <Box>
          {visibleRows.map((row, index) => (
            <MotionCard
              key={row.id || index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              custom={index}
              sx={{
                mb: 2,
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                position: "relative",
              }}
            >
              {/* Decorative top bar */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background: "linear-gradient(90deg, #03c5db, #f0e786)",
                  zIndex: 1,
                }}
              />

              <CardContent sx={{ p: 2 }}>
                {columns.map((column, colIndex) => (
                  <Box key={column.id} sx={{ mb: 1.5 }}>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 500 }}>
                      {column.label}:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: column.id === "name" ? 600 : 400 }}>
                      {column.format && typeof row[column.id] === "number"
                        ? column.format(row[column.id])
                        : row[column.id]}
                    </Typography>
                  </Box>
                ))}

                <Divider sx={{ my: 1.5 }} />

                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                  <ButtonHaver row={row} />
                </Box>
              </CardContent>
            </MotionCard>
          ))}

          <TablePagination
            component="div"
            count={rows.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            sx={{
              ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
                fontFamily: "Poppins, sans-serif",
              },
              ".MuiTablePagination-select": {
                fontFamily: "Poppins, sans-serif",
              },
            }}
          />
        </Box>
      ) : (
        // Desktop table view
        <Box>
          <MotionTableContainer
            component={Paper}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            sx={{
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Decorative top bar */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "4px",
                background: "linear-gradient(90deg, #03c5db, #f0e786)",
                zIndex: 1,
              }}
            />

            <Table stickyHeader aria-label="data table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <StyledTableHeadCell
                      key={column.id}
                      align={column.align || "left"}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </StyledTableHeadCell>
                  ))}
                  <StyledTableHeadCell align="center">Actions</StyledTableHeadCell>
                </TableRow>
              </TableHead>

              <TableBody>
                <AnimatePresence>
                  {visibleRows.map((row, index) => (
                    <MotionTableRow
                      key={row.id || index}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      custom={index}
                      sx={{ cursor: "pointer" }}
                    >
                      {columns.map((column) => {
                        const value = row[column.id]
                        return (
                          <StyledTableCell key={column.id} align={column.align || "left"}>
                            {column.format && typeof value === "number" ? column.format(value) : value}
                          </StyledTableCell>
                        )
                      })}
                      <StyledTableCell align="center">
                        <ButtonHaver row={row} />
                      </StyledTableCell>
                    </MotionTableRow>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </MotionTableContainer>

          <TablePagination
            component="div"
            count={rows.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            sx={{
              mt: 2,
              ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
                fontFamily: "Poppins, sans-serif",
              },
              ".MuiTablePagination-select": {
                fontFamily: "Poppins, sans-serif",
              },
            }}
          />
        </Box>
      )}
    </AnimatePresence>
  )
}

export default TableTemplate

const StyledTableHeadCell = styled(TableCell)`
  background: linear-gradient(135deg, #03c5db, #0d47a1);
  color: white;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  padding: 16px;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: none;
  
  &:first-of-type {
    border-top-left-radius: 8px;
  }
  
  &:last-of-type {
    border-top-right-radius: 8px;
  }
`

const StyledTableCell = styled(TableCell)`
  font-family: 'Poppins', sans-serif;
  padding: 16px;
  border-bottom: 1px solid rgba(3, 197, 219, 0.1);
  
  &:first-of-type {
    font-weight: 500;
  }
`

