import { render, screen, fireEvent } from "@test/utils";
import { DataTable } from "@/components/DataTable";
import { describe, it, expect, vi } from "vitest";

describe("DataTable", () => {
  interface MockData {
    id: string;
    name: string;
    role: string;
  }

  const columns = [
    { key: "name", header: "Name" },
    { key: "role", header: "Role" },
    {
      key: "actions",
      header: "Actions",
      render: (item: MockData) => <button>{`View ${item.name}`}</button>,
    },
  ];

  const data: MockData[] = [
    { id: "1", name: "Alice", role: "Admin" },
    { id: "2", name: "Bob", role: "User" },
  ];

  it("renders headers and data correctly", () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        keyExtractor={(item) => item.id}
      />,
    );

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Role")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("User")).toBeInTheDocument();
  });

  it("handles custom rendering", () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        keyExtractor={(item) => item.id}
      />,
    );

    expect(screen.getByText("View Alice")).toBeInTheDocument();
    expect(screen.getByText("View Bob")).toBeInTheDocument();
  });

  it("calls onRowClick when a row is clicked", () => {
    const onRowClick = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={data}
        keyExtractor={(item) => item.id}
        onRowClick={onRowClick}
      />,
    );

    fireEvent.click(screen.getByText("Alice").closest("tr")!);
    expect(onRowClick).toHaveBeenCalledWith(data[0]);
  });

  it("renders empty message when no data", () => {
    render(
      <DataTable
        columns={columns}
        data={[]}
        keyExtractor={(item) => (item as any).id}
        emptyMessage="No results found"
      />,
    );

    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  it("uses default empty message from i18n", () => {
    render(
      <DataTable
        columns={columns}
        data={[]}
        keyExtractor={(item) => (item as any).id}
      />,
    );

    expect(screen.getByText("No data available")).toBeInTheDocument();
  });
});
